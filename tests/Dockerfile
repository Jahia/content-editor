FROM cypress/browsers:node14.19.0-chrome100-ff99-edge

ARG MAVEN_VER="3.8.1"
ARG MAVEN_BASE_URL="https://archive.apache.org/dist/maven/maven-3"

RUN apt-get update && apt-get install -y jq default-jdk

RUN wget -nv -O maven.zip ${MAVEN_BASE_URL}/${MAVEN_VER}/binaries/apache-maven-${MAVEN_VER}-bin.zip \
    && unzip maven.zip -d /opt \
    && ln -s /opt/apache-maven-${MAVEN_VER}/bin/mvn /usr/local/bin/mvn \
    && rm maven.zip

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
#RUN cd /home/jahians/provisioning/content-editor-dependencies \
#    && mvn -ntp -q -U clean install

RUN cd /home/jahians/provisioning && mvn -ntp -q -U clean process-resources

RUN cp /home/jahians/provisioning/target/dependency/jahia-*.yaml /home/jahians/provisioning/4-additional-modules.yaml
#RUN cp /home/jahians/provisioning/target/dependency/content-editor-dependencies-*.yaml /home/jahians/provisioning/5-ce-dependencies.yaml

CMD ["/bin/bash", "-c", "/home/jahians/env.run.sh"]
