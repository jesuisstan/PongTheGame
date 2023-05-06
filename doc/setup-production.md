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

4. Make sure you have a domain name (a local network DNS will do)

5. Create a 42 intra application [here](https://profile.intra.42.fr/oauth/applications). Fill out the form. For the `Redirect URI` field, put `http://{hostname}/api/auth/42`, with `{hostname}` being the hostname of your machine (i.e., `example.com`).

6. Copy the 42 credentials into `.env`.

7. Create a Github application [here](https://github.com/settings/applications/new). Fill out the form. For the `Authorization callback URL`, put `http://{hostname}/api/github/auth`, with `{hostname}` being the hostname of your machine (i.e., `example.com`).

8. Copy the Github credentials into `.env`.

Your .env file should look like this:

```sh
SERVER_NAME=bbrassart.fr

FRONTEND_PORT=80
FRONTEND_URL=http://${SERVER_NAME}

POSTGRES_USER=pg
POSTGRES_PASSWORD=pg

INTRA42_CLIENT_ID="u-s4t2ud-..."
INTRA42_CLIENT_SECRET="s-s4t2ud-..."

GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

SESSION_SECRET="IVVjwgtiee5Ebq3ExRgUBsUsDebbhpeU3CwI5WjoND4="
TOTP_SECRET="KBCFYZ7E4ZFTB3TB2I5KM5WSCF5DSHKKONKH5PHUIZSYRBGVRMMA===="
JWT_SECRET="JK72VJg4K3fBcpg5UGLGk+YhKlSixyDA8gqfwwfF2dE="

MAX_CHATROOM_NBR=30
MAX_CHATROOM_MEMBER_NBR=100
```

Of course, adjust to your needs.
