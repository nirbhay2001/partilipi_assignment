FROM node:18-alpine
WORKDIR /notification
COPY package*.json .
RUN npm install -f
COPY . .
EXPOSE 6000
CMD ["npm", "run", "start"]