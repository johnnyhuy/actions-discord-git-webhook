FROM node:16-alpine

WORKDIR /opt/workspace

COPY ./src /opt/workspace

RUN npm ci

ENTRYPOINT [ "node", "/opt/workspace/src/index.js" ]