FROM alpine:latest

RUN apk update
RUN apk add --update nodejs nodejs-npm yarn unzip

RUN \
  echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories \
  && apk --no-cache  update \
  && apk --no-cache  upgrade \
  && apk add --no-cache --virtual .build-deps \
    gifsicle pngquant optipng libjpeg-turbo-utils \
    udev ttf-opensans chromium \
  && rm -rf /var/cache/apk/* /tmp/*

#RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

RUN wget https://chromedriver.storage.googleapis.com/74.0.3729.6/chromedriver_linux64.zip
RUN unzip chromedriver_linux64.zip

ENV CHROME_BIN /usr/bin/chromium-browser

EXPOSE 4444
