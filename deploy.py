import os, requests, datetime, subprocess

DOCKER_USER = "thibaultkine"
API_NAME = "dkbldr-api"
APP_NAME = "dkbldr-app"

RAILWAY_API_URL = "https://backboard.railway.app/graphql/v2"
RAILWAY_TOKEN = os.environ.get("RAILWAY_TOKEN")
RAILWAY_API_SERVICE_ID = os.environ.get("RAILWAY_API_SERVICE_ID")
RAILWAY_APP_SERVICE_ID = os.environ.get("RAILWAY_APP_SERVICE_ID")

TAG = datetime.datetime.now().strftime("%Y%m%d%H%M%S")


def run(cmd):
    print(f"$ {cmd}")
    subprocess.run(cmd, shell=True, check=True)


def docker_build_and_push(name, path):
    image = f"{DOCKER_USER}/{name}:{TAG}"
    run(f"docker build -t {image} {path}")
    run(f"docker push {image}")
    return image


def railway_get_deployment_id(service_id):
    query = """
    query GetLatestDeployment($serviceId: String!) {
        service(id: $serviceId) {
            deployments(first: 1) {
                edges {
                    nodes {
                        id
                        createdAt
                        status
                    }
                }
            }
        }
    }
    """

    variables = { "serviceId": service_id }

    headers = { 
        "Authorization": f"Bearer {RAILWAY_TOKEN}",
        "Content-Type": "application/json" 
    }

    res = requests.post(
        RAILWAY_API_URL,
        json={ "query": query, "variables": variables },
        headers=headers
    )
    if res.status_code == 200:
        data = res.json()
        deployments = data["data"]["service"]["deployments"]["edges"]
        if deployments:
            deployment = deployments[0]["node"]
            return deployment["id"]
        else:
            print("No deployment found for this service")
    else:
        print("Error:", res.status_code, res.text)


def railway_update(service_id, image):
    deployment_id = railway_get_deployment_id(service_id)

    mutation = """
    mutation RedeployService($serviceId: String!, $deploymentId: String!) {
        serviceInstanceRedeploy(serviceId: $serviceId, input: {
            image: \"""" + f"{image}:{TAG}" + """\"
        }) {
            id
            status
        }
    }
    """

    variables = {
        "serviceId": service_id,
        "deploymentId": deployment_id
    }

    headers = { 
        "Authorization": f"Bearer {RAILWAY_TOKEN}",
        "Content-Type": "application/json" 
    }

    req = requests.post(
        RAILWAY_API_URL,
        json={ "query": mutation, "variables": variables },
        headers=headers
    )
    req.raise_for_status()
    print("Railway update response:", req.json())


def main():
    print("[1/3] Building and pushing API...")
    api_image = docker_build_and_push(API_NAME, "./api")

    print("[2/3] Building and pushing app...")
    app_image = docker_build_and_push(APP_NAME, "./")

    print("[3/3] Updating Railway services...")
    railway_update(RAILWAY_API_SERVICE_ID, api_image)
    railway_update(RAILWAY_APP_SERVICE_ID, app_image)

    print("🚀 Deployment successful with tag:", TAG)


if __name__ == "__main__":
    main()