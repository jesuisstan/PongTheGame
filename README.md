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



## Requirements
- installed Docker
- installed Makefile (for the development mode)

## How to use
### To run the production build of the app
1. Modify .env file into the root directory of the App (follow the detailed setup instuction in `doc/setup_production.md`
2. Run cmd:
```sh
docker compose up --build
```
3. To clean up the System of all files created by PongTheGame use cmd:
```sh
docker system prune --volumes --all --force
```

### To run the app in the development mode
1. Modify .env file into the root directory of the App (follow the detailed setup instuction in `doc/setup_development.md`
2. Run cmd:
```sh
make
```
3. To clean up the System of all files created by PongTheGame use cmd:
```sh
make fclean
```
or
```sh
docker-compose down --rmi all --volumes --remove-orphans
```
