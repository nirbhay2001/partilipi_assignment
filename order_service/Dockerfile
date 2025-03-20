FROM node:18-alpine
WORKDIR /orderservice
COPY package*.json .
RUN npm install -f
COPY . .
EXPOSE 7000
CMD ["npm", "run", "start"]