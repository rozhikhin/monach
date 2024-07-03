FROM php:8.2-fpm

USER root

# Set working directory
WORKDIR /var/www

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libzip-dev \
    libpng-dev \
    libjpeg62-turbo-dev \
    libjpeg-dev \
    libwebp-dev \
    libxpm-dev \
    libfreetype6 \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    libpq-dev \
    libmemcached-dev \
    iputils-ping \
    libz-dev \
    libssl-dev \
    zlib1g \
    libmagickwand-6.q16 \
    ghostscript


# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install extensions
RUN docker-php-ext-install pdo_mysql mysqli zip exif pcntl pdo pdo_pgsql

RUN docker-php-ext-configure gd \
    --with-webp \
    --with-jpeg \
    --with-freetype


RUN docker-php-ext-install gd

#RUN pear channel-update -f pear.php.net \
#    && pear install Net_URL2-2.1.2 \
#    && pear install HTTP_Request2-2.2.1


#RUN pecl install memcached

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN curl -sL https://deb.nodesource.com/setup_20.x  | bash -
RUN apt-get install -y nodejs
RUN echo "NODE Version:" && node --version
RUN echo "NPM Version:" && npm --version

#RUN apt-get update && apt-get install -y libmagickwand-6.q16-dev --no-install-recommends && rm -rf /var/lib/apt/lists/*
#RUN printf "\n" | pecl install imagick
#RUN docker-php-ext-enable imagick



# Copy existing application directory contents
#COPY ./dev.okn.local /var/www/dev.okn.local
#COPY ./dev.okn-mk.local /var/www/dev.okn-mk.local

# Copy existing application directory permissions

# Change current user to www-data
USER www-data

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]

