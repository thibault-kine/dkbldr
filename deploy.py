import os, requests, datetime, subprocess

DOCKER_USER = "thibaultkine"
API_NAME = "dkbldr-api"
APP_NAME = "dkbldr-app"

RAILWAY_API_URL = "https://backboard.railway.com/graphql/v2"
RAILWAY_TOKEN = os.environ.get("RAILWAY_TOKEN")

RAILWAY_API_SERVICE_ID = os.environ.get("RAILWAY_API_SERVICE_ID")
RAILWAY_API_ENV_ID = os.environ.get("RAILWAY_API_ENV_ID")

RAILWAY_APP_SERVICE_ID = os.environ.get("RAILWAY_APP_SERVICE_ID")
RAILWAY_APP_ENV_ID = os.environ.get("RAILWAY_APP_ENV_ID")

TAG = datetime.datetime.now().strftime("%Y%m%d%H%M%S")


def run(cmd):
    print(f"$ {cmd}")
    subprocess.run(cmd, shell=True, check=True)


def docker_build_and_push(name, path):
    image = f"{DOCKER_USER}/{name}:{TAG}"
    run(f"docker build -t {image} {path}")
    run(f"docker push {image}")
    return image


def railway_update(service_id, env_id, image):
    mutation = """
    mutation serviceInstanceUpdate($environmentId: String!, $input: ServiceInstanceUpdateInput!, $serviceId: $String!) {
        serviceInstanceUpdate(environmentId: $id, input: $input, serviceId: $serviceId) {
            environmentId
            input
            serviceId
        }
    }
    """

    variables = {
        "environmentId": env_id,
        "serviceId": service_id,
        "input": {
            "source": {
                "image": image
            }
        }
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


def railway_redeploy(env_id, service_id):
    mutation = """
    mutation serviceInstanceRedeploy($environmentId: String!, $serviceId: $String!) {
        serviceInstanceRedeploy(environmentId: $id, serviceId: $serviceId) {
            environmentId
            input
            serviceId
        }
    }
    """

    variables = {
        "environmentId": env_id,
        "serviceId": service_id
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
    railway_update(RAILWAY_API_SERVICE_ID, RAILWAY_API_ENV_ID, api_image)
    railway_update(RAILWAY_APP_SERVICE_ID, RAILWAY_APP_ENV_ID, app_image)

    print("🚀 Deployment successful with tag:", TAG)


if __name__ == "__main__":
    main()