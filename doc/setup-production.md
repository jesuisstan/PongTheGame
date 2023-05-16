# Production setup instructions

1. Clone the repository:

```sh
git clone https://github.com/jesuisstan/PongTheGame.git
```

2. Enter the cloned repository folder:

```sh
cd transcendence
```

3. Copy `.env.production.example` to `.env`

```sh
cp .env.production.example .env
```

4. Adjust SERVER_NAME and FRONTEND_PORT into `.env` file (an IP address or a local hostname works) if requied to you.

5. If you have an Ecole 42 account and prefer to login with it, create a 42 intra application [here](https://profile.intra.42.fr/oauth/applications/new) or modify existing [here](https://profile.intra.42.fr/oauth/applications).\
Fill out the form. For the `Redirect URI` field, input `http://{hostname[:port]}/api/auth/42/callback`, with `{hostname}` being the hostname of your machine (i.e., `http://localhost:3000/api/auth/42/callback`).

6. Copy the 42 credentials into `.env`.

7. If you prefer to login with Github, create a new Github application [here](https://github.com/settings/applications/new) or modify existing [here](https://github.com/settings/apps).\
Fill out the form. For the `Authorization callback URL`, input `http://{hostname[:port]}/api/auth/github/callback`, with `{hostname}` being the hostname of your machine (i.e., `(http://localhost:3000/api/auth/github/callback)`).

8. Copy the Github credentials into `.env`.

Your .env file should look like this:

```sh
SERVER_NAME=localhost

FRONTEND_PORT=3000
FRONTEND_URL=http://${SERVER_NAME}

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
