COMPOSE := docker compose -f docker-compose.yml -f docker-compose.dev.yml

.PHONY: all up build clean fclean re down logs ps hc-logs

all up:
	$(COMPOSE) up -d --build

build down ps restart start:
	$(COMPOSE) $@ $(c)

logs:
	$(COMPOSE) logs $(c) --follow

# healthcheck logs
# pipe to jq for pretty printing and colors
hc-logs:
	@docker inspect --format "{{json .State.Health }}" $(c) | python3 -mjson.tool

# Clone .env file from the private Github repository, copy it to the root directory
# then remove the cloned directory
env:
	rm -rf pong_env
	git clone git@github.com:jesuisstan/pong_env.git
	cp pong_env/.env .
	rm -rf pong_env

# Shut all containers down and delete them
clean:
	$(COMPOSE) down -v --rmi all --remove-orphans 2> /dev/null

# Clean and delete all unused volumes, containers, networks and images
fclean: clean
	docker system prune --volumes --all --force 2> /dev/null
	rm -rf ./backend/dist
	rm -rf ./backend/node_modules
	rm -rf ./frontend/node_modules

re: fclean all
