FROM node:18.13.0-alpine3.16

# Creating a working directory inside the container
WORKDIR /app-backend

RUN yarn install && yarn global add nodemon

# Copying our files to the container
COPY . .

# Run server.js with nodemon instead of node (auto refresh)
# ENTRYPOINT  yarn install && yarn add nodemon && nodemon server
ENTRYPOINT nodemon server
 