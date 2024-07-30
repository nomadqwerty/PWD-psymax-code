#!/bin/bash
# Source: https://serverfault.com/a/1149540/1112904

VERSION=${1:-2.29.1}

sudo curl -sSL \
    https://github.com/docker/compose/releases/download/v${VERSION}/docker-compose-linux-x86_64 \
    -o /var/lib/google/docker-compose

sudo chmod +x /var/lib/google/docker-compose
mkdir -p ~/.docker/cli-plugins
ln -sf /var/lib/google/docker-compose ~/.docker/cli-plugins/docker-compose

echo "* Installed docker-compose version ${VERSION}"
echo "* Run 'docker compose version' to verify installation"
