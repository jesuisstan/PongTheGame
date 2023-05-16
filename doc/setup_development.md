# Production setup instructions

1. Clone the repository:

```sh
git clone https://github.com/jesuisstan/PongTheGame.git
```

2. Enter the cloned repository folder:

```sh
cd transcendence
```

3. Copy `.env.development.example` to `.env`

```sh
cp .env.development.example .env
```

4. Adjust SERVER_NAME, FRONTEND_PORT and BACKEND_PORT into `.env` file (an IP address or a local hostname works) if requied to you.

5. If you have an Ecole 42 account and prefer to login with it, create a 42 intra application [here](https://profile.intra.42.fr/oauth/applications/new) or modify existing [here](https://profile.intra.42.fr/oauth/applications).\
Fill out the form. For the `Redirect URI` input `http://{hostname:port}/auth/42/callback`, with `{hostname}` being the hostname of your machine and `port` being the backend server port (i.e., `http://localhost:3080/auth/42/callback`).

6. If you prefer to login with Github, create a new Github application [here](https://github.com/settings/applications/new) or modify existing [here](https://github.com/settings/apps).\
Fill out the form. For the `Callback URL` input `http://{hostname:port}/auth/github/callback`, with `{hostname}` being the hostname of your machine and `port` being the backend server port (i.e., `http://localhost:3080/auth/github/callback`).

7. Copy the 42 and Github credentials into `.env`.

Your .env file should look like this:

```sh
SERVER_NAME=localhost

FRONTEND_PORT=3000
FRONTEND_URL=http://${SERVER_NAME}:${FRONTEND_PORT}
BACKEND_PORT=3080
BACKEND_URL=http://${SERVER_NAME}:${BACKEND_PORT}

POSTGRES_USER=pg
POSTGRES_PASSWORD=pg

INTRA42_CLIENT_ID=u-s4t2ud-368...
INTRA42_CLIENT_SECRET=s-s4t2ud-e73...

GITHUB_CLIENT_ID=Iv1.c6...
GITHUB_CLIENT_SECRET=4c92...

SESSION_SECRET=helloWorld
TOTP_SECRET=HELLOWORLD666
JWT_SECRET=helloWorld

```
