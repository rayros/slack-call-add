FROM ubuntu

RUN apt update && \
  curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
  DEBIAN_FRONTEND="noninteractive" apt install -yy nodejs && \
  wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  DEBIAN_FRONTEND="noninteractive" apt install -yy google-chrome-stable && \
  rm -rf /var/lib/apt/lists/*
