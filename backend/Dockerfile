FROM node:20-alpine

# Install Docker CLI for judge execution
RUN apk add --no-cache docker-cli

WORKDIR /app

COPY package*.json ./

# --omit=dev skips devDependencies (mongodb-memory-server, nodemon)
# This ensures mongodb-memory-server is NEVER installed in production
RUN npm ci --omit=dev

COPY . .

# Create temp directory for judge
RUN mkdir -p temp

# Set production environment
ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "server.js"]
