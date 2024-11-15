FROM node:21 AS build

WORKDIR /SanAgustin

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

# Copia los archivos compilados al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Comienza el servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
