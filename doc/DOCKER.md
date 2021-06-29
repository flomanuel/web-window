# Setting up the Project

Create a file called _authorized_keys_ under _docker/ssh/_.

If you want to debug the render process with my run/debug WebStorm configuration, add your public key. This is used for
creating a ssh tunnel between the container and host because otherwise WebStorm can't access the DevTools inside the
container.

Also add a public/private key pair (_id_rsa.pub_ & _id_rsa_) under _docker/ssh/_.

From inside the projects main folder type `docker-compose up --build`.

## SSH into the Container

Use the following command to SSH into the container: `docker exec -it -u <user> <container name> /bin/bash`.

There are two users: _root_ and _developer_`.

Inside the container, the project files are located under `/opt/project/`. Navigate into the app folder and install the
npm dependencies (`npm i`) as user _developer_.

## Running the application

You still have to be inside the container. From the projects main folder run `npm run start`.
