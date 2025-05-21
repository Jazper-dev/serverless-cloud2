# Use Node base image (แทนที่ Bun ด้วย Node)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies with npm
COPY package.json package-lock.json ./ 
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port 5173 (ถ้าใช้ Vite)
EXPOSE 5173

# Start Vite dev server with npm
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Stage 1: Build React App
# FROM node:18-alpine AS build

# WORKDIR /app
# COPY package.json ./
# RUN npm install -g pnpm
# RUN pnpm install

# COPY . .
# RUN pnpm run build

# # Stage 2: Serve with Nginx
# FROM nginx:alpine

# # Remove default nginx static assets
# RUN rm -rf /usr/share/nginx/html/*

# COPY --from=build /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf

# EXPOSE 5173
# CMD ["nginx", "-g", "daemon off;"]
