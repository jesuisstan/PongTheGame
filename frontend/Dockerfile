FROM node:18.13.0-alpine3.16

# Creating a working directory inside the container
WORKDIR /app-frontend

# Copying our files to the container
COPY . .

ENTRYPOINT npm install -g npm@latest && npm install && npm run start