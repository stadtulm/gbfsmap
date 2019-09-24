FROM node:lts AS builder
COPY . /app
WORKDIR /app
RUN npm ci
RUN npm run-script build

FROM nginx
COPY --from=builder /app/dist/ /usr/share/nginx/html
EXPOSE 80