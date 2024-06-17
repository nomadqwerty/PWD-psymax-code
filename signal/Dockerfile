FROM node:20.8.1-alpine AS base

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Set environment variables
ENV CHROMIUM_PATH /usr/bin/chromium-browser
ENV QPDF_PATH /usr/bin/qpdf

# Install dependencies
RUN apk add --no-cache udev ttf-freefont chromium qpdf

# Install project dependencies
RUN npm install

# Copy app source code
COPY . .

# Expose port and start application
EXPOSE 4000
CMD [ "npm", "start" ]
