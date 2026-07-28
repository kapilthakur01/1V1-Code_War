FROM node:20-alpine

# Install C++ compiler and Java runtime for local code execution
# (Docker-in-Docker is not available on Render — executor.js uses local fallback)
RUN apk add --no-cache \
    g++ \
    openjdk17-jdk \
    bash

WORKDIR /app

COPY package*.json ./

# --omit=dev skips devDependencies (mongodb-memory-server, nodemon)
RUN npm ci --omit=dev

COPY . .

# Create temp directory for judge
RUN mkdir -p temp

# Set production environment
ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "server.js"]
