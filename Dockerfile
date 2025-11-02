# Base image
FROM node:21

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
# build + migrations
RUN npm run build
#RUN npm run migration:up

# Start the server using the production build
CMD node build/main.js
#CMD [ "node", "dist/main.js" ]