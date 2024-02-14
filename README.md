### puppet-master

- start server:
  - `npm start`
- docker build on Apple Silicon:
  - `docker build --platform linux/amd64 -t ppt-master .`
- docker run on Apple Silicon:
  - `docker run --platform linux/amd64 -p 3000:8080 ppt-master`

- docker compose fetches the Apple Silicon image from docker hub and runs it:
  - `docker-compose up`