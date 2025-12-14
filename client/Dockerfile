# 1. Use Node.js
FROM node:20-alpine

# 2. Set folder
WORKDIR /app

# 3. Install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy code
COPY . .

# 5. Open Port
EXPOSE 5173

# 6. Start Vite (Host flag is required for Docker)
CMD ["npm", "run", "dev", "--", "--host"]