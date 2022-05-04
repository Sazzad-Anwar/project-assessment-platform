<!-- PROJECT Title -->
<br />
<h2 align="center"><a href="https://github.com/Sazzad-Anwar/project-assessment-platform">Project assessment platform's backend API</a></h2>

The APIs have been developed for project assessment platform. It has been build with `Node.js`, `MongoDB`, `JWT`. The project's purpose is to make it easier for the students to assess their projects by mentors. It has role based access management. The APIs are secured with JWT. The protected routes are not accessible without `JWT`. All `APIs` have been tested using `Supertest` and `Jest`. For easily uploading it to production server `Docker` and `Docker-compose` has been used and the entire application has been scaled up with `NGINX`.

## Installation Manual

First clone the repository and then run the following command to install the dependencies.

```bash
yarn
```

with npm

```bash
npm install
```

Initialize the `.env` file for the development and production mode.

```bash
MONGO_URI=mongodb://mongo:27017/project-assesment-platform
PORT=8080
REDIS_PORT=6379
ACCESS_TOKEN_SECRET_KEY=
REFRESH_TOKEN_SECRET_KEY=
REFRESH_TOKEN_EXPIRES_IN=1y
ACCESS_TOKEN_EXPIRES_IN=1d
ACCESS_COOKIE_EXPIRES_IN=31536000000
```

To start the server as development use the following command.

```bash
yarn dev-server
```

with npm

```bash
npm run dev-server
```

To run the whole project on production use the following command using docker.

```bash
docker-compose up -d
```

For the production the whole app will be running on the port 80 as the nginx will be used for load balancing.

The `API` routes will be found on this address `http://localhost:8080/api/v1`
