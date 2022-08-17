#!/bin/bash
# This script can be used to manually build the docker images necessary to run the tests
# It should be executed from the tests folder

source ./set-env.sh

# It assumes that you previously built the module you're going to be testing
#   and that the modules artifacts are located one level up

if [ ! -d ./artifacts ]; then
  mkdir -p ./artifacts
fi

if [[ -e ../target ]]; then
  cp ../target/*-SNAPSHOT.jar ./artifacts/
fi

basedir=$(pwd)

cd ${basedir}/provisioning/content-editor-dependencies || exit
mvn -ntp -s ../../../.github/maven.settings.xml -q -U clean install

cd ${basedir}/provisioning || exit
mvn -ntp -s ../../.github/maven.settings.xml -q -U clean process-resources

cd ${basedir} || exit

cp ./provisioning/target/dependency/jahia-*.yaml ./provisioning/4-additional-modules.yaml
cp ./provisioning/target/dependency/content-editor-dependencies-*.yaml ./provisioning/5-ce-dependencies.yaml
ls -lah ./provisioning

docker build -t ${TESTS_IMAGE} .
