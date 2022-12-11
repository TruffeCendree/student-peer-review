# student-peer-review
A web-based peer review for animating tutorial sessions

# Usage

## Dockerfile

```yml
version: "2"

services:
  https-portal:
    image: steveltn/https-portal:1
    links:
      - peer
    ports:
      - '80:80'
      - '443:443'
    environment:
      DOMAINS: 'peer.thomas-veillard.fr -> http://peer:5001'
      STAGE: 'production'
    volumes:
      - ./data/https-portal:/var/lib/https-portal

  mariadb:
    image: mariadb
    volumes:
      - ./data/mariadb:/var/lib/mysql:rw
    environment:
      MYSQL_ROOT_PASSWORD:
      MYSQL_DATABASE: peer_review

  peer:
    build: ./student-peer-review
    links:
      - mariadb
    volumes:
      - ./data/peer:/app/public:rw
    environment:
      FASTIFY_PORT: 5001
      FASTIFY_ADDR: 0.0.0.0
      FASTIFY_LOGGING: 'true'
      BASE_URL: https://peer.thomas-veillard.fr
      DATABASE_HOST: mariadb
      DATABASE_PORT: 3306
      DATABASE_USER: root
      DATABASE_PASS: 
      DATABASE_NAME: peer_review
      DATABASE_LOGGING: 'true'
      DATABASE_SYNC: 'false'
      COOKIE_NAME: sessionId
      COOKIE_SECRET: 
      COOKIE_SIGNED: 'true'
      COOKIE_HTTP_ONLY: 'true'
      COOKIE_SECURE: 'true'
      COOKIE_MAX_AGE: 15552000
      SMTP_HOST: 
      SMTP_PORT: 
      SMTP_SECURE: 'true'
      SMTP_USER: 
      SMTP_PASS: 
      SMTP_FROM: noreply@peer.thomas-veillard.fr
      MULTIPART_MAX_SIZE: 16777216
      MULTIPART_MAX_FILES: 1
```

## CLI import of students and assignment to projects

```
node dist/server/bin/import-students.js --excelFile ~/Téléchargements/m2-se1-students.xlsx
node dist/server/bin/add-students-to-project.js --excelFile ~/Téléchargements/m2-se1-students.xlsx --projectId 1
```

const project = await dataSource.getRepository(Project).findOneById(1)
await project.assignSubmissions(1)
