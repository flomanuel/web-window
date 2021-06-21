FROM ubuntu:20.04
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y curl libglib2.0-dev libxshmfence-dev libnss3 libnss3-dev libatk1.0 libatk1.0-dev libatk-bridge2.0 \
libatk-bridge2.0-dev libdrm-dev libgtk-3-dev libgtkextra-dev libcanberra-gtk-module libcanberra-gtk3-module libgconf2-dev libasound2 libxtst-dev libxss1 ffmpeg fakeroot
ENV DEBIAN_FRONTEND=newt
RUN curl -fsSL https://deb.nodesource.com/setup_15.x | bash - && apt-get install -y nodejs
RUN useradd -s /bin/bash -d /home/florian/ -m -G sudo florian
RUN mkdir /app && chown florian /app/ && chgrp florian /app/
CMD tail -f /dev/null
