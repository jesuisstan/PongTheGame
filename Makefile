# Try removing the dash if you're using the compose plugin
# (docker compose)
COMPOSE = docker compose
# COMPOSE = sudo docker-compose

.PHONY: all build up clean fclean re

all: up

# Build/rebuild an image
build:
	$(COMPOSE) build

# Shut down containers if up, build all images and run detached containers
up:
	# sudo chmod 777 /etc/hosts
	# sudo echo "127.0.0.1 transcendance.fr" >> /etc/hosts
	# sudo echo "127.0.0.1 www.transcendance.fr" >> /etc/hosts
	$(COMPOSE) up -d --build

# Clone .env file from the private Github repository, copy it to the root directory
# then remove the cloned directory
env:
	rm -rf ft_transcendance_env
	git clone git@github.com:daisvke/ft_transcendance_env.git
	cp ft_transcendance_env/.env .
	rm -rf ft_transcendance_env

# Get the private Github repository containing the .env file
envrep:
	git clone git@github.com:daisvke/ft_transcendance_env.git

# Shut all containers down and delete them
clean:
	@echo "\033[33mCleaning...\033[0m"
	$(COMPOSE) down -v --rmi all --remove-orphans 2> /dev/null

# Clean and delete all unused volumes, containers, networks and images
fclean: clean
	docker system prune --volumes --all --force 2> /dev/null
	# sudo docker system prune --volumes --all --force 2> /dev/null

re: fclean all

# Launch prisma studio
prisma-studio:
	docker exec -it backend sh -c 'yarn prisma studio'