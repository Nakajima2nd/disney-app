FROM node:lts-buster-slim
WORKDIR /code
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
CMD yarn dev