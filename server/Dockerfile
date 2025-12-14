# 1. Use Node.js (Linux version)
FROM node:18-alpine

# 2. Set the folder inside the box
WORKDIR /app

# 3. Copy package files first (for speed caching)
COPY package*.json ./
RUN npm install

# 4. Copy the rest of your code
COPY . .

# 5. Open the Port
EXPOSE 5001

# 6. Start Command
CMD ["npm", "start"]