FROM node:20-alpine AS build

WORKDIR /app

# Copy all source files
COPY . .

# Always delete any copied node_modules (avoids Windows permission issues)
# and do a clean install on Linux
RUN rm -rf node_modules
RUN npm install

# Build args — baked into the static JS bundle by Vite
ARG VITE_API_URL
ARG VITE_BACKEND_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
