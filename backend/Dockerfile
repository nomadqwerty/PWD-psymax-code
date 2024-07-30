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
RUN apk add g++ make python3 linux-headers
RUN apk add --update py3-pip

# Install project dependencies
RUN npm install

RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.1.2/zsh-in-docker.sh)"

# Copy app source code
COPY . .

# Expose port and start application
EXPOSE 4000
CMD [ "npm", "start" ]
