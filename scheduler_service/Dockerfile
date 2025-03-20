FROM node:18-alpine
WORKDIR /schedular
COPY package*.json .
RUN npm install -f
COPY . .
EXPOSE 9000
CMD ["npm", "run", "start"]