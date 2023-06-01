# PongTheGame App
This project is about creating a website for the mighty Ping Pong contest.\
It is based on the final team-project "ft_transcendence" of Ecole 42 Common Сore educational program.\
PongTheGame App:
- includes user account and a real-time multiplayer online game;
- uses a PostgreSQL database;
- Backend is written in NestJS, Frontend - with React TypeScript.

The game is available on http://pongthegame.rocks (or [direct IP address](http://209.38.216.33:3000/))

## Demonstration
PongTheGame is a single-page Web App with responsive design:

https://github.com/jesuisstan/PongTheGame/assets/82715902/25a46f33-e990-446a-8c26-8897e02cecf0


PongTheGame provides user interface:
- Any user is able to login using the OAuth system of 42 intranet or Github;
- Users are able to choose unique nicknames, delete and upload avatars, enable two-factor authentication and check their match history and achievement.

https://github.com/jesuisstan/PongTheGame/assets/82715902/f9e22f90-c868-44c8-81ba-8f6a326e540f


PongTheGame allowes users to train with Artificial Intelligence:

https://github.com/jesuisstan/PongTheGame/assets/82715902/dce63131-be80-46ef-9d02-8828c5fbc414


But the main purpose of this website is to play Ping Pong versus other players.\
Users are able to play classic game with a random online player or invite a specific player to join customized game.\
Users can follow, block or invite other users and see their current status (online, offline, playing, preparingToPlay):

https://github.com/jesuisstan/PongTheGame/assets/82715902/80ea5a0b-d21b-4473-a370-cadd87e1b7a2


Users are also able to spectate other players' games:

https://github.com/jesuisstan/PongTheGame/assets/82715902/1dbf71fd-4cd9-492f-80e0-2778bd6e4dc4


Game itself is a canvas game and it is also responsive:

https://github.com/jesuisstan/PongTheGame/assets/82715902/42b01978-19e3-4416-9425-04e8c959a6cd


## Requirements
- Internet
- installed [Docker](https://docs.docker.com/engine/install/) (to run production build on your machine)
- installed Makefile (to run in development mode)

## How to use
### To try Pong the Game:
Just proceed to the site http://pongthegame.rocks
### To run the production build of the app on your computer:
1. Modify .env file into the root directory of the App\
(follow the detailed setup instuction in `doc/setup_production.md`)
3. Run cmd:
```sh
docker compose up --build
```
3. Open http://SERVER_NAME:FRONTEND_PORT to play Pong The Game in your browser.
4. To clean up the System of all files created by PongTheGame use cmd:
```sh
docker system prune --volumes --all --force
```

### To run the app in development mode on your computer:
1. Modify .env file into the root directory of the App\
(follow the detailed setup instuction in `doc/setup_development.md`)
3. Run cmd:
```sh
make
```
or
```sh
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```
3. Open http://SERVER_NAME:FRONTEND_PORT to play Pong The Game in your browser.
4. To clean up the System of all files created by PongTheGame use cmd:
```sh
make fclean
```
or
```sh
docker-compose down --rmi all --volumes --remove-orphans
rm -rf ./backend/dist
rm -rf ./backend/node_modules
rm -rf ./frontend/node_modules
```
