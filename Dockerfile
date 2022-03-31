FROM node:alpine 

#Create app dir
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apk add --no-cache --update libgcc libstdc++ ca-certificates libcrypto1.1 libssl1.1 libgomp expat git

RUN apk add --no-cache dumb-init

#Install Dependencies
COPY package.json /usr/src/app
RUN yarn install

#Bundle app source
COPY . /usr/src/app

ENV LD_LIBRARY_PATH=/usr/local/lib
COPY --from=jrottenberg/ffmpeg:4.4-alpine313 /usr/local /usr/local/

ENV PORT 3000
EXPOSE 3000

HEALTHCHECK --interval=10m --timeout=5s \
  CMD curl -f http://localhost:$PORT/healthz || exit 1

ENTRYPOINT []
CMD [ "dumb-init","node", "app.js" ]