FROM node:latest
RUN apt install bash -y
RUN npm install nodemon --global
RUN npm install uglifycss uglifyjs --global
WORKDIR /app
ADD . /app
RUN yarn && yarn build
EXPOSE 8000
CMD ["yarn", "start"] 