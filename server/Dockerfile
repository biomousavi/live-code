FROM node:18.12.1-alpine as development
RUN apk update && apk add bash
WORKDIR /usr/src/server
COPY package*.json ./
RUN npm install
COPY . . 
ENV NODE_ENV=development
CMD [ "npm", "run", "start:dev" ]
EXPOSE ${SERVER_PORT}