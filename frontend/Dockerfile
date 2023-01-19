FROM node:19-alpine3.16

# Working directory inside the container
WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

ENTRYPOINT ["npm", "run", "start"]
