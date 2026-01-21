FROM node:20-alpine

WORKDIR /usr/src/app

# Instalamos PM2 globalmente
RUN npm install pm2 -g

# Copiamos solo los archivos de dependencias para aprovechar el cache de Docker
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el archivo de configuración de PM2 (para que esté en la raíz del contenedor)
COPY pm2.config.js ./

# NOTA: No copiamos la carpeta /src aquí porque el docker-compose 
# la sobreescribirá con el mapeo de volumen de tu Windows.

EXPOSE 3000

# Arrancamos PM2
CMD ["pm2-runtime", "pm2.config.js"]
