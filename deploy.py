import os, requests, datetime, subprocess

DOCKER_USER = "thibaultkine"
API_NAME = "dkbldr-api"
APP_NAME = "dkbldr-app"

RAILWAY_API_URL = "https://backboard.railway.com/graphql/v2"
RAILWAY_TOKEN = os.getenv("RAILWAY_TOKEN")
RAILWAY_API_ID = os.getenv("RAILWAY_API_SERVICE_ID")
RAILWAY_APP_ID = os.getenv("RAILWAY_APP_SERVICE_ID")

TAG = datetime.datetime.now().strftime("%Y%m%d%H%M%S")

def run(cmd):
    print(f"$ {cmd}")
    subprocess.run(cmd, shell=True, check=True)

def docker_build_and_push(name, path):
    image = f"{DOCKER_USER}/{name}:{TAG}"
    run(f"docker build -t {image} {path}")
    run(f"docker push {image}")
    return image

def railway_update(service_id, image):
    query = """
    mutation serviceUpdate($id: String!, $input: ServiceUpdateInput!) {
        serviceUpdate(id: $id, input: $input) {
            id
            name
            updatedAt
        }
    }
    """

    variables = {
        "id": service_id,
        "input": {
            "source": {
                "image": {
                    "repository": image,
                    "tag": TAG
                }
            }
        }
    }

    headers = { "Authorization": f"Bearer {RAILWAY_TOKEN}" }
    req = requests.post(
        RAILWAY_API_URL,
        json={ "query": query, "variables": variables },
        headers=headers
    )
    req.raise_for_status()
    print("Railway update response:", req.json())


def main():
    print("Building and pushing API...")
    api_image = docker_build_and_push(API_NAME, "./api")

    print("Building and pushing app...")
    app_image = docker_build_and_push(APP_NAME, "./")

    print("Updating Railway services...")
    railway_update(RAILWAY_API_ID, api_image)
    railway_update(RAILWAY_APP_ID, app_image)

    print("Deployment successful with tag:", TAG)


if __name__ == "__main__":
    main()