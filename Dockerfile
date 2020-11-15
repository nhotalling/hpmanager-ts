FROM node:latest

WORKDIR /dist

COPY package*.json .
COPY tsconfig.json .
COPY /src /dist/src

RUN npm ci --quiet --only=production && npm install tsc -g
RUN npm run build

# App binds to 8080, expose it here to have it mapped by docker daemon
EXPOSE 8080

CMD ["node", "./dist/server.js"]