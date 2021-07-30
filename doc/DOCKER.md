# Setting up the Project

Create a file called _authorized_keys_ under _docker/ssh/_.

If you want to debug the render process with my run/debug WebStorm configuration, add your public key. This is used for
creating a ssh tunnel between the container and host because otherwise WebStorm can't access the DevTools inside the
container.

Also add a public/private key pair (_id_rsa.pub_ & _id_rsa_) under _docker/ssh/_.

From inside the projects root folder type `docker-compose up --build`.

## SSH into the Container

Use the following command to SSH into the container: `docker exec -it -u <user> <container name> /bin/bash`.

There are two users: _root_ and _developer_`.

Inside the container, the project files are located under `/opt/project/`. Navigate into the app folder and install the
npm dependencies (`npm i`) as user _developer_.

## Running the application

Inside the container, switch to the user _developer_.

Before running the application (for the first time, or after you made changes to the code), you need to build the
packages with webpack. From the projects root folder run either `npm run wp_dev` or `npm run wp_build`.

You can also use the command `npm run wp_watch` to build the packages and activate webpack's file watcher.

Now you can run the application. From the projects root folder run `npm run el_start`.
