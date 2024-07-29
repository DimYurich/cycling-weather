FROM node:14
WORKDIR /app
COPY package.json tsconfig.json ./
RUN yarn install
COPY . .
CMD ["yarn", "start"]
