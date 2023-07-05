FROM cypress/browsers:node16.16.0-chrome107-ff107-edge

ARG MAVEN_VER="3.8.1"
ARG MAVEN_BASE_URL="https://archive.apache.org/dist/maven/maven-3"

RUN apt-get update && apt-get install -y jq

RUN adduser --disabled-password jahians

USER jahians
WORKDIR /home/jahians

COPY --chown=jahians:jahians package.json yarn.lock /home/jahians/

RUN mkdir -p /home/jahians/run-artifacts /home/jahians/results /home/jahians/cypress/plugins

#CI=true reduces the verbosity of the installation logs
RUN CI=true yarn install

COPY --chown=jahians:jahians . /home/jahians

RUN CI=true /home/jahians/node_modules/.bin/cypress install

COPY --chown=jahians:jahians maven.settings.xml /home/jahians/.m2/settings.xml

CMD /bin/bash -c /home/jahians/env.run.sh
