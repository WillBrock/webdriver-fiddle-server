FROM ubuntu:latest

RUN apt update
RUN apt install -y sudo wget curl gnupg2

# Setup Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
RUN apt update && apt install -y yarn

# It's a good idea to use dumb-init to help prevent zombie chrome processes.
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

# Setup Node
RUN curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
RUN apt update
RUN apt install -y nodejs
RUN apt install -y build-essential
RUN apt install -y make
RUN apt install -y unzip

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list

RUN apt update && apt install -y google-chrome-stable

# Setup Chromedriver
RUN wget https://chromedriver.storage.googleapis.com/$(curl -sS chromedriver.storage.googleapis.com/LATEST_RELEASE)/chromedriver_linux64.zip
RUN unzip ./chromedriver_linux64.zip

EXPOSE 4444
