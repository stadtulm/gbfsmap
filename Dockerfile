FROM node as build

WORKDIR /code
COPY . /code
RUN mv /code/config.example.js /code/config.js
RUN npm install && npm run build


FROM nginx
EXPOSE 80
COPY --from=build /code/dist/ /usr/share/nginx/html/

