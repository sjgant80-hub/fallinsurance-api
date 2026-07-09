FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY src ./src
EXPOSE 8383
ENV PORT=8383
CMD ["node", "src/server.js"]
