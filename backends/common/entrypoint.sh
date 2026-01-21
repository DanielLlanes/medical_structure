#!/bin/bash
set -e

# Permisos de Laravel
chown -R www-data:www-data /var/www/medical
if [ -d "/var/www/medical/storage" ]; then
    chmod -R 775 /var/www/medical/storage /var/www/medical/bootstrap/cache
fi

# El comando exec "$@" permite que el CMD del Dockerfile (supervisord) se ejecute
exec "$@"