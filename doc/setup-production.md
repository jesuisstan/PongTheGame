# Production setup instructions

1. Clone the repository

```sh
git clone https://github.com/benjaminbrassart/transcendence.git
```

2. `cd` into it

```sh
cd transcendence
```

3. Copy `.env.production.example` to `.env`

```sh
cp .env.production.example .env
```

4. Make sure you have a domain name (an IP address or a local hostname will do), and copy it into `.env`.

5. Create a 42 intra application [here](https://profile.intra.42.fr/oauth/applications). Fill out the form. For the `Redirect URI` field, put `http://{hostname[:port]}/api/auth/42/callback`, with `{hostname}` being the hostname of your machine (i.e., `example.com`).

6. Copy the 42 credentials into `.env`.

7. Create a Github application [here](https://github.com/settings/applications/new). Fill out the form. For the `Authorization callback URL`, put `http://{hostname[:port]}/api/auth/github/callback`, with `{hostname}` being the hostname of your machine (i.e., `example.com`).

8. Copy the Github credentials into `.env`.

Your .env file should look like this:

```sh
SERVER_NAME=localhost

FRONTEND_PORT=80
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
9. Run cmd `docker compose up --build`
