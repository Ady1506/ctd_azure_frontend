FROM node:18 

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Expose the Vite dev server port
EXPOSE 5173

# Set environment variables if needed
ENV HOST=0.0.0.0

# Start Vite dev server
CMD ["npm", "run", "dev"]
