# Stage 1: Build Vite app
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

COPY . .
RUN npm run build  # Builds into /app/dist

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built files from builder to Nginx public dir
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Custom Nginx config (to support SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for Azure
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
