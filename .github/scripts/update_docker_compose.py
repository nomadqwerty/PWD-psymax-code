import yaml
import sys


def update_docker_compose(
    compose_file, project_id, short_sha, region, repo_name, gh_repo_name
):
    with open(compose_file, "r") as f:
        data = yaml.safe_load(f)

    for service_name, service in data["services"].items():
        if "image" not in service:
            service["image"] = (
                f"{region}-docker.pkg.dev/{project_id}/{repo_name}/{gh_repo_name}-{service_name}:{short_sha}"
            )
        if "build" in service:
            del service["build"]

    with open(compose_file, "w") as f:
        yaml.safe_dump(data, f, default_flow_style=False)


if __name__ == "__main__":
    if len(sys.argv) != 7:
        print(
            "Usage: update_docker_compose.py <compose_file> <project_id> <short_sha> <region> <repo_name> <gh_repo_name>"
        )
        sys.exit(1)

    compose_file = sys.argv[1]
    project_id = sys.argv[2]
    short_sha = sys.argv[3]
    region = sys.argv[4]
    repo_name = sys.argv[5]
    gh_repo_name = sys.argv[6]

    update_docker_compose(
        compose_file, project_id, short_sha, region, repo_name, gh_repo_name
    )
