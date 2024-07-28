import yaml
import sys
from typing import List

ENV_SECRET_DELIMITER = "__DELIM__"


def update_docker_compose(
    compose_file: str,
    project_id: str,
    short_sha: str,
    region: str,
    repo_name: str,
    gh_repo_name: str,
    nginx_config_path: str,
    nginx_certificate_path: str,
    nginx_certificate_key_path: str,
    env_vars: List[str],
):
    with open(compose_file, "r") as f:
        data = yaml.safe_load(f)

    for service_name, service in data["services"].items():
        # Add image from Artifact Registry if not already present
        if "image" not in service:
            service["image"] = (
                f"{region}-docker.pkg.dev/{project_id}/{repo_name}/{gh_repo_name}-{service_name}:{short_sha}".lower()
            )
        # Remove build section if present (not needed for Artifact Registry)
        if "build" in service:
            del service["build"]
        # Remove env_file section if present (not needed for Artifact Registry)
        if "env_file" in service:
            del service["env_file"]

    # Add environment variables to services
    for var in env_vars:
        key, *_value = var.split("=")
        value = "=".join(_value)
        services = data["services"]
        _, env_var_service, env_key = key.split(ENV_SECRET_DELIMITER)
        if "environment" not in services[env_var_service.lower()]:
            services[env_var_service.lower()]["environment"] = []

        services[env_var_service.lower()]["environment"].append(f"{env_key}={value}")

    # Add nginx service
    data["services"]["nginx"] = {
        "image": "nginx",
        "ports": ["80:80", "443:443"],
        "volumes": [
            f"{nginx_config_path}:/etc/nginx/conf.d/default.conf",
            f"{nginx_certificate_path}:/etc/nginx/ssl/server.crt",
            f"{nginx_certificate_key_path}:/etc/nginx/ssl/server.key",
        ],
        # Wait for all services to be up before starting nginx
        "depends_on": list(data["services"].keys()),
    }

    # Write updated docker-compose.yml file
    with open(compose_file, "w") as f:
        yaml.safe_dump(data, f, default_flow_style=False)


if __name__ == "__main__":
    if not len(sys.argv) >= 10:
        print(
            "Usage: update_docker_compose.py <compose_file> <project_id> <short_sha> <region> <repo_name> <gh_repo_name> <nginx_config_path> <nginx_certificate_path> <nginx_certificate_key_path> [<*env_vars>]"
        )
        sys.exit(1)

    compose_file = sys.argv[1]
    project_id = sys.argv[2]
    short_sha = sys.argv[3]
    region = sys.argv[4]
    repo_name = sys.argv[5]
    gh_repo_name = sys.argv[6]
    nginx_config_path = sys.argv[7]
    nginx_certificate_path = sys.argv[8]
    nginx_certificate_key_path = sys.argv[9]
    env_vars = sys.argv[10:]

    update_docker_compose(
        compose_file,
        project_id,
        short_sha,
        region,
        repo_name,
        gh_repo_name,
        nginx_config_path,
        nginx_certificate_path,
        nginx_certificate_key_path,
        env_vars,
    )
