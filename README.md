# PongTheGame App
This project is about creating a website for the mighty Ping Pong contest.\
It is based on the final team-project "ft_transcendence" of Ecole 42 Common Сore educational program.\
PongTheGame App:
- includes user account and a real-time multiplayer online game;
- uses a PostgreSQL database;
- Backend is written in NestJS, Frontend - with React TypeScript.

## Demonstration
PongTheGame is a single-page Web App with responsive design:

https://github.com/jesuisstan/PongTheGame/assets/82715902/8c937127-335b-44e3-ab50-dfe0bcc16894


PongTheGame provides user interface:
- Any user is able to login using the OAuth system of 42 intranet or Github;
- Users are able to choose unique nicknames, delete and upload avatars, enable two-factor authentication and check their match history and achievement.

https://github.com/jesuisstan/PongTheGame/assets/82715902/fdbb12f8-a3a0-4a64-a0e9-93943ef22c46


PongTheGame allowes users to train with Artificial Intelligence:

https://github.com/jesuisstan/PongTheGame/assets/82715902/6f4bdbe1-0070-4788-a183-f29267375c12


But the main purpose of this website is to play Ping Pong versus other players.\
Users are able to play classic game with a random online player or invite a specific player to join customized game.\
Users can follow, block or invite other users and see their current status (online, offline, playing, preparingToPlay):

https://github.com/jesuisstan/PongTheGame/assets/82715902/80ea5a0b-d21b-4473-a370-cadd87e1b7a2


Users are also able to spectate other players' games:

https://github.com/jesuisstan/PongTheGame/assets/82715902/1dbf71fd-4cd9-492f-80e0-2778bd6e4dc4


Game itself is a canvas game and it is also responsive:

https://github.com/jesuisstan/PongTheGame/assets/82715902/d8a503aa-360a-4b1d-8ade-54756e813fd7


## Setup
For detailed setup instuctions, please read `doc/setup-production.md`\
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


### Production

Use `docker compose` to interact with the production services.


