FROM node:12-alpine as build-step

RUN mkdir /app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build
