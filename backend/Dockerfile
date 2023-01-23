FROM node:18.13.0-alpine3.16

# Creating a working directory inside the container
WORKDIR /app-backend

# nodemon isn't copied to the container when not installed globally
RUN yarn install && yarn global add nodemon

# ENTRYPOINT  yarn install && yarn add nodemon && nodemon server
ENTRYPOINT nodemon server
 