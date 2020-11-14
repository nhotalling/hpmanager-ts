FROM node:latest

WORKDIR /dist

# Bundle source code inside the Docker image
# COPY . .

COPY package*.json .
COPY tsconfig.json .
COPY /src /dist/src
#RUN npm install && npm install tsc -g
# If you are building your code for production
RUN npm ci --only=production && npm install tsc -g
RUN npm run build

# App binds to 8080, expose it here to have it mapped by docker daemon
EXPOSE 8080
#ENTRYPOINT ["node", "dist/server.js"]

#CMD ["npm", "start"]
CMD ["node", "./dist/server.js"]