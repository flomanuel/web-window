#! /bin/bash
docker exec -u root web-window_app_1 /etc/init.d/ssh restart
ssh -4 -L 9223:localhost:9222 root@localhost -N
