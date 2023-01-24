FROM node:18.13.0-alpine3.16

# Working directory inside the container
WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@latest
RUN npm install

COPY ./ ./

ENTRYPOINT ["npm", "run", "start"]