FROM node:20-alpine

# Install Docker CLI for judge execution
RUN apk add --no-cache docker-cli

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Create temp directory for judge
RUN mkdir -p temp

EXPOSE 5000

CMD ["node", "server.js"]
