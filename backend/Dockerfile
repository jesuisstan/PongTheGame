FROM node:18.13-alpine3.16

# Working directory inside the container
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./ ./

RUN npm run start

ENTRYPOINT [ "node", "server.js" ]
