# Use the official Node.js image as the base
FROM node:14 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Pass environment variables to the build process
ARG REACT_APP_BACKEND_IP
ENV REACT_APP_BACKEND_IP=${REACT_APP_BACKEND_IP}

# Build the application
RUN npm run build

# Use the official Nginx image to serve the application
FROM nginx:alpine

# Copy the build output to the Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
