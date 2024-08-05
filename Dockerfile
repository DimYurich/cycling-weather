FROM node:22-alpine
WORKDIR /app
COPY package.json tsconfig.json yarn.lock ./
RUN yarn install
# COPY . .  is replaced with volume mount in run-local.sh
CMD ["yarn", "start"]
