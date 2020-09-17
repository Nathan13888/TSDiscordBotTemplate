FROM node:lts-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./
RUN npm install
# If you are building your code for production
RUN npm ci --only=production

COPY . ./

#EXPOSE 8080
CMD npm start

