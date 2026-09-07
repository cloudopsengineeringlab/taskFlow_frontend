
# premiere etape : builder l'application react
FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# deuxieme etape : servir l'application avec nginx
FROM nginx:1.27-alpine

RUN apk update && apk upgrade


COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]