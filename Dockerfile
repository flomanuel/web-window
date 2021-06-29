FROM ubuntu:20.04
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get upgrade -y &&  apt-get install -y curl libglib2.0-dev libxshmfence-dev libnss3 libnss3-dev libatk1.0 \
libatk1.0-dev libatk-bridge2.0 libatk-bridge2.0-dev libdrm-dev libgtk-3-dev libgtkextra-dev libcanberra-gtk-module \
libcanberra-gtk3-module libgconf2-dev libasound2 libxtst-dev libxss1 ffmpeg fakeroot sudo nano
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && apt-get install -y nodejs

RUN apt-get update && apt-get install -y openssh-server openssh-client
COPY docker/ssh/docker_ssh.conf /etc/ssh/sshd_config.d/

COPY docker/ssh/id_rsa.pub /root/.ssh/
COPY docker/ssh/id_rsa /root/.ssh/
COPY docker/ssh/authorized_keys /root/.ssh/

RUN useradd -s /bin/bash -d /home/developer/ -m developer
RUN mkdir /opt/project && chown developer /opt/project/ && chgrp developer /opt/project/
ENV DEBIAN_FRONTEND=newt

CMD tail -f /dev/null
