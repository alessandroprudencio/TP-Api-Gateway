FROM node:16-alpine

RUN apk add --no-cache bash

RUN yarn global add @nestjs/cli

WORKDIR /usr/tennis-player/tp-api-gateway

COPY package*.json ./

RUN yarn  

COPY . .