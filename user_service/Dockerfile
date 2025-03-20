FROM node:18-alpine
WORKDIR /user
COPY package*.json .
RUN npm install -f
COPY . .
EXPOSE 5000
CMD ["npm", "run", "start"]