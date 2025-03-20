FROM node:18-alpine
WORKDIR /graphqlgateway
COPY package*.json .
RUN npm install -f
COPY . .
EXPOSE 4000
CMD ["npm", "run", "start"]