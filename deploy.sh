#!/usr/bin/env bash

readonly BASEDIR=$(cd "$(dirname "$0")" && pwd) # where the script is located
readonly CALLDIR=$(pwd)                         # where it was called from

readonly APP_NAME=demoapp
readonly AWS_ACCOUNT=109754198917
readonly AWS_REGION=eu-west-2

check_installed () {
    local cmd=$1
    if ! hash $1 2> /dev/null; then
        echo "Error: '$cmd' command was not found"
        echo "Try: brew install $cmd"
        exit 1
    fi
}

check_aws_credentials () {
    if [[ -z "$AWS_PROFILE" && -z "$AWS_ACCESS_KEY_ID" ]]; then
        echo "Error: did not find AWS credentials"
        echo "Try: export AWS_PROFILE=$APP_NAME"
        exit 1
    fi
}

push_new_docker_image () {
    local name tag
    local "$@"
    $(aws ecr get-login --no-include-email --region $AWS_REGION)
    docker build -t $name:$tag .
    docker tag $name:$tag $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/$name:$tag
    docker push $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/$name:$tag
}

# Validation
check_installed aws
check_installed docker
check_aws_credentials

# Build client
cd "$BASEDIR"/demo-client
./build.sh

# Build API
cd "$BASEDIR"/demo-api
timestamp=$(date +"%Y%m%d%H%M")
push_new_docker_image name=$APP_NAME tag=$timestamp
