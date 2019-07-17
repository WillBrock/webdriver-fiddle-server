FROM debian:latest
FROM python:latest
FROM java:latest

USER root

MAINTAINER willb@focusschoolsoftware.com
RUN printf "deb http://archive.debian.org/debian/ jessie main\ndeb-src http://archive.debian.org/debian/ jessie main\ndeb http://security.debian.org jessie/updates main\ndeb-src http://security.debian.org jessie/updates main" > /etc/apt/sources.list
RUN printf "deb [check-valid-until=no] http://archive.debian.org/debian jessie-backports main" > /etc/apt/sources.list.d/jessie-backports.list
RUN printf "Acquire::Check-Valid-Until false;" > /etc/apt/apt.conf.d/10-nocheckvalid
RUN printf 'Package: *\nPin: origin "archive.debian.org"\nPin-Priority: 500' > /etc/apt/preferences.d/10-archive-pin
RUN apt-get update
RUN apt-get install -y --no-install-recommends apt-utils
RUN apt-get install -y sudo
RUN apt-get install -y wget
RUN apt-get install -y less
RUN apt-get install -y vim
RUN apt-get install -y subversion
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
RUN apt-get install -y nodejs
RUN apt-get install -y build-essential
RUN apt-get install -y make
RUN apt-get install -y chromium
RUN apt-get install -y unzip

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
RUN sudo sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update
RUN apt-get install -y google-chrome-stable
#COPY ./focus-automation /staging
#RUN cd /staging && npm config set unsafe-perm true && rm -rf node_modules package-lock.json && npm install

#RUN wget https://chromedriver.storage.googleapis.com/2.42/chromedriver_mac64.zip
#RUN unzip chromedriver_mac64.zip

RUN wget https://chromedriver.storage.googleapis.com/75.0.3770.90/chromedriver_linux64.zip
RUN unzip ./chromedriver_linux64.zip

EXPOSE 4444
