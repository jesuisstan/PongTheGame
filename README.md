# Trancendence [![Backend](https://github.com/benjaminbrassart/transcendence/actions/workflows/backend.yml/badge.svg?branch=master)](https://github.com/benjaminbrassart/transcendence/actions/workflows/backend.yml)  [![Frontend](https://github.com/benjaminbrassart/transcendence/actions/workflows/frontend.yml/badge.svg?branch=master)](https://github.com/benjaminbrassart/transcendence/actions/workflows/frontend.yml)

This is a 42 school's first web project and last project of the common core.

:warning: **Warning**: It is educational project.

:warning: **Warning**: You can take inspiration from it but please don't copy / paste what you don't understand.

## Description

This project is about creating a single-page application website for the mighty Pong contest!

It includes a user interface, a chat, and a real-time multiplayer online game.

It uses docker compose, TypeScript, React (frontend), nestjs (backend), prisma (ORM) and postgres (database).

## Setup

### Foreword

There are 2 environments available: production and development. Each have a .env.example file which contains all the variables
needed for the services to start properly.

To use a specific environment (when deploying on a server, for example), copy the `.env.$environment.example` to `.env`.
To use both environment (when testing deployment on the development machine), copy the `.env.$environment.example` to `.env.$environment`. Switch between environment using the `setenv.sh` script like this: `./setenv.sh [dev|prod]`. `.env` will be symlinked to either `.env.development` or `.env.production`.

### Development

Because of the configuration merging, essentially everything in development uses the Makefile to interact with docker compose. In fact, the Makefile uses the command `docker compose -f docker-compose.yml -f docker-compose.dev.yml` to override the production configuration.

```sh
make                        # build and start

make build [c=container]    # build a container (all if `c` not specified)

make down [c=container]     # stop and remove a container (all if `c` not specified)

make ps [c=container]       # show the status of a container (all if `c` not specified)

make logs [c=container]     # show the logs of a container (all if `c` not specified)

make hc-logs c=container    # show the healthcheck logs of a container

make clean                  # stop and remove containers, volumes, networks and images

make fclean                 # remove everything created by docker (be careful, uses `docker system prune`)
```

Example .env for development

```sh
# .env.development

FRONTEND_PORT=3000
FRONTEND_URL=http://localhost:${FRONTEND_PORT}
BACKEND_PORT=3080
BACKEND_URL=http://localhost:${BACKEND_PORT}

# postgres user data, does not really matter since the database is self-contained
POSTGRES_USER=
POSTGRES_PASSWORD=

# 42 oauth application credentials, get them here https://profile.intra.42.fr/oauth/applications
INTRA42_CLIENT_ID=
INTRA42_CLIENT_SECRET=

# github oauth application credentials, get them here https://github.com/settings/developers
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# session secret, can be anything
SESSION_SECRET=

# secret for 2fa, must be a RFC 4648 base32 string
# https://en.wikipedia.org/w/index.php?title=Base32&oldid=1148232062#RFC_4648_Base32_alphabet
TOTP_SECRET=

# secret for jwt session tokens, can be anything
JWT_SECRET=

# integers
MAX_CHATROOM_NBR=30
MAX_CHATROOM_MEMBER_NBR=100
```

### Production

Use `docker compose` to interact with the production services.

```sh
# .env.production

# the server name used by nginx, for example "transcendence.bbrassar.fr"
SERVER_NAME=

FRONTEND_PORT=3000
FRONTEND_URL=http://${SERVER_NAME}:${FRONTEND_PORT}

# There is no BACKEND_URL environment variable because the backend is served by nginx, accessible at ${FRONTEND_URL}/api

# everything else is the same as dev envrionment
POSTGRES_USER=
POSTGRES_PASSWORD=

INTRA42_CLIENT_ID=
INTRA42_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

SESSION_SECRET=
TOTP_SECRET=
JWT_SECRET=

MAX_CHATROOM_NBR=30
MAX_CHATROOM_MEMBER_NBR=100
```

For detailed setup instuctions, please read `doc/setup-production.md`
