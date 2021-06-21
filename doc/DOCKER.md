# Setting up the Project

With your prefered CLI, navigate into the projects main folder and type `docker-compose up --build`. If you already
built the container, just type `docker-compose up`.

## SSH into the Container

Use the following command to SSH into the container. There are two users: `root` and `florian` (non-root user).
`docker exec -it -u <user> <container name> /bin/bash`

In the container, the project is located under `/app/`. Navigate into the app folder and install the npm
dependencies (`npm i`) as user `florian`.

## Running the application

You still have to be inside the container. From the projects main folder run `npm start`.
