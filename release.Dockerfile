FROM node:20-alpine

RUN apk --update add git
RUN npm i --unsafe-perm -g standard-version
RUN npm i --unsafe-perm -g conventional-github-releaser
