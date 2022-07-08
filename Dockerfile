FROM node

COPY . /

ENTRYPOINT [ "npm", "start" ]