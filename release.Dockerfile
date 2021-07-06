FROM node:16-alpine

RUN apk --update add git
RUN npm i --unsafe-perm -g standard-version
RUN npm i --unsafe-perm -g conventional-github-releaser
RUN git config --global user.name "github-actions"
RUN git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"