FROM node:latest
run apt install bash -y
RUN npm install nodemon -g
run npm install uglifycss uglifyjs --global
WORKDIR /app
ADD . /app
RUN npm install
EXPOSE 8000
CMD ["npm", "start"] 