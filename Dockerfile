# # Set base image
# FROM node:alpine

# # Set working directory
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code
# COPY . .

# # Command to run the application
# CMD ["npm", “run”, “package-linux”]


FROM node:14

# stuff needed to get Electron to run
RUN apt-get update && apt-get install \
    git libx11-xcb1 libxcb-dri3-0 libxtst6 libnss3 libatk-bridge2.0-0 libgtk-3-0 libxss1 libasound2 \
    -yq --no-install-suggests --no-install-recommends \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Electron doesn't like to run as root
RUN useradd -d /programmable-matter programmable-matter
USER programmable-matter

WORKDIR /programmable-matter
COPY . .
RUN npm install
RUN npx electron-rebuild

# Electron needs root for sandboxing
# see https://github.com/electron/electron/issues/17972
USER root
RUN chown root /programmable-matter/node_modules/electron/dist/chrome-sandbox
RUN chmod 4755 /programmable-matter/node_modules/electron/dist/chrome-sandbox

USER programmable-matter
CMD npm run dev