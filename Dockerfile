# Use the official Node.js 20 image as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for npm install
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build your TypeScript project
RUN npm run build

# Make port 80 available to the world outside this container
EXPOSE 80

# Run `cdk deploy` when the container launches
CMD ["npx", "cdk", "deploy", "--require-approval", "never"]