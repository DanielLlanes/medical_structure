FROM nginx:alpine

# Instalamos curl por si necesitamos hacer healthchecks después
RUN apk add --no-cache curl

# Eliminamos la configuración por defecto para usar la nuestra
RUN rm /etc/nginx/conf.d/default.conf

# El puerto 443 es el principal según tu esquema SSL
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
