FROM node:20-alpine

WORKDIR /opt/workspace

COPY ./src /opt/workspace/src
COPY ./package-lock.json /opt/workspace/package-lock.json
COPY ./package.json /opt/workspace/package.json

RUN npm ci

ENTRYPOINT [ "node", "/opt/workspace/src/app.js" ]