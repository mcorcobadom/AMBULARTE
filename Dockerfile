FROM php:8.2-apache

# Instalar extensiones PHP necesarias
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Instalar wait-for-it para esperar MySQL
RUN apt-get update && apt-get install -y \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Descargar wait-for-it script
RUN wget -O /wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
    && chmod +x /wait-for-it.sh

# Habilitar mod_rewrite de Apache
RUN a2enmod rewrite

# Configurar Apache para permitir .htaccess
RUN echo '<Directory /var/www/html>\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' >> /etc/apache2/apache2.conf

# Crear script de inicio que espera MySQL
RUN echo '#!/bin/bash\n\
echo "🎨 Iniciando AmbulArte..."\n\
echo "⏳ Esperando MySQL..."\n\
\n\
# Esperar a que MySQL esté disponible\n\
/wait-for-it.sh db:3306 --timeout=60 --strict -- echo "✅ MySQL disponible"\n\
\n\
echo "🚀 Iniciando Apache..."\n\
echo "✅ AmbulArte disponible en http://localhost:8080"\n\
\n\
# Iniciar Apache\n\
exec apache2-foreground' > /start.sh && chmod +x /start.sh

# Copiar archivos del proyecto
COPY . /var/www/html/

# Configurar permisos
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Exponer puerto 80
EXPOSE 80

# Comando por defecto
CMD ["/start.sh"]