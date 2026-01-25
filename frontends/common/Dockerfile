# 1️⃣ Base: PHP 8.4 FPM sobre Debian Bookworm
FROM php:8.4-fpm-bookworm

# 2️⃣ Dependencias del sistema e IDIOMAS (Locales)
RUN apt-get update && apt-get install -y \
    bash curl git unzip cron supervisor imagemagick \
    libmagickwand-dev \
    libpng-dev libjpeg-dev libfreetype6-dev libzip-dev \
    libicu-dev libonig-dev libxml2-dev \
    libwebp-dev libavif-dev \
    wkhtmltopdf fontconfig xz-utils libxrender1 libxext6 \
    locales \ 
    && sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen \
    && locale-gen \
    && rm -rf /var/lib/apt/lists/*

# Configuración de variables de entorno para UTF-8
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

# 3️⃣ Extensiones PHP (Optimizadas para Laravel 12)
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp --with-avif \
    && docker-php-ext-install \
    pdo_mysql exif pcntl bcmath gd intl zip xml

# 4️⃣ Instalación de Imagick
RUN printf "\n" | pecl install imagick && docker-php-ext-enable imagick

# 5️⃣ Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/medical

# 6️⃣ Configuración de CRON
COPY ./cron/schedule-cron /etc/cron.d/schedule-cron
RUN sed -i 's/\r$//' /etc/cron.d/schedule-cron \
    && chmod 0644 /etc/cron.d/schedule-cron \
    && crontab /etc/cron.d/schedule-cron

# 7️⃣ Configuración de SUPERVISOR
COPY ./supervisor/master.conf /etc/supervisor/conf.d/master.conf
RUN sed -i 's/\r$//' /etc/supervisor/conf.d/master.conf \
    && mkdir -p /var/log/supervisor \
    && chown -R www-data:www-data /var/log/supervisor
RUN mkdir -p /var/run/supervisor \
    && chmod 755 /var/run/supervisor

# 🔟 SOLUCIÓN PARA ERROR DE GIT
RUN git config --global --add safe.directory /var/www/medical/landing && \
    git config --global --add safe.directory /var/www/medical/tenant && \
    git config --global --add safe.directory /var/www/medical/landlord && \
    git config --global --add safe.directory /var/www/medical/api && \
    git config --global --add safe.directory /var/www/medical/api-shared

# 8️⃣ Script de entrada (Entrypoint)
COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint.sh \
    && chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/master.conf"]