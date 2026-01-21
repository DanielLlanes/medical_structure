# 1️⃣ Base: PHP 8.4 FPM sobre Debian Bookworm (Estabilidad máxima)
FROM php:8.4-fpm-bookworm

# 2️⃣ Dependencias del sistema
# Incluye herramientas para PDF, Imágenes, Cron y Supervisor
RUN apt-get update && apt-get install -y \
    bash curl git unzip cron supervisor imagemagick \
    libmagickwand-dev \
    libpng-dev libjpeg-dev libfreetype6-dev libzip-dev \
    libicu-dev libonig-dev libxml2-dev \
    libwebp-dev libavif-dev \
    wkhtmltopdf fontconfig xz-utils libxrender1 libxext6 \
    && rm -rf /var/lib/apt/lists/*

# 3️⃣ Extensiones PHP (Optimizadas para Laravel 12)
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp --with-avif \
    && docker-php-ext-install \
       pdo_mysql exif pcntl bcmath gd intl zip xml

# 4️⃣ Instalación de Imagick (Compilación para PHP 8.4)
RUN printf "\n" | pecl install imagick && docker-php-ext-enable imagick

# 5️⃣ Composer (Herramienta de dependencias PHP)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Directorio de trabajo
WORKDIR /var/www/medical

# 6️⃣ Configuración de CRON
COPY ./cron/schedule-cron /etc/cron.d/schedule-cron
# Reparar formato Windows, dar permisos y registrar en el sistema
RUN sed -i 's/\r$//' /etc/cron.d/schedule-cron \
    && chmod 0644 /etc/cron.d/schedule-cron \
    && crontab /etc/cron.d/schedule-cron

# 7️⃣ Configuración de SUPERVISOR
COPY ./supervisor/master.conf /etc/supervisor/conf.d/master.conf
# Reparar formato Windows y crear carpeta de logs necesaria
RUN sed -i 's/\r$//' /etc/supervisor/conf.d/master.conf \
    && mkdir -p /var/log/supervisor \
    && chown -R www-data:www-data /var/log/supervisor

RUN mkdir -p /var/run/supervisor \
    && chmod 755 /var/run/supervisor

# 8️⃣ Script de entrada (Entrypoint)
COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint.sh \
    && chmod +x /usr/local/bin/entrypoint.sh

# Exponer el puerto de PHP-FPM
EXPOSE 8000

# El entrypoint prepara el entorno y el CMD arranca Supervisor para mantener todo vivo
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/master.conf"]