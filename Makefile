# Variables
DOCKER_USER_NAME=whchien
BACKEND_IMAGE_NAME=fin-reader-backend
BACKEND_CONTAINER_NAME=fin-reader-backend-container
BACKEND_PORT=8000

FRONTEND_IMAGE_NAME=fin-reader-frontend
FRONTEND_CONTAINER_NAME=fin-reader-frontend-container
FRONTEND_PORT=3000

PYTHONPATH=$(pwd)
OPENAI_API_KEY="<your_key>>"  # Replace <your_key> with your actual OpenAI API key

# Targets
.PHONY: all build-backend build-frontend build run-backend run-frontend run stop-backend stop-frontend stop up start-backend start-frontend start

# Default target
all: build run

# Build the Docker images
build-backend:
	cd backend && docker build -t $(BACKEND_IMAGE_NAME) .

build-frontend:
	cd frontend && docker build -t $(FRONTEND_IMAGE_NAME) .

# Run the Docker containers
run-backend:
	docker run -d --name $(BACKEND_CONTAINER_NAME) -p $(BACKEND_PORT):$(BACKEND_PORT) $(BACKEND_IMAGE_NAME)

run-frontend:
	docker run -d --name $(FRONTEND_CONTAINER_NAME) -p $(FRONTEND_PORT):$(FRONTEND_PORT) $(FRONTEND_IMAGE_NAME)

# Stop and remove the Docker containers
stop-backend:
	docker stop $(BACKEND_CONTAINER_NAME) && docker rm $(BACKEND_CONTAINER_NAME)

stop-frontend:
	docker stop $(FRONTEND_CONTAINER_NAME) && docker rm $(FRONTEND_CONTAINER_NAME)

# Run with Docker Compose
up:
	docker-compose up --build

down:
	docker-compose down

# Start backend with environment setup
start-backend:
	cd backend && \
	export PYTHONPATH=$(PYTHONPATH) OPENAI_API_KEY=$(OPENAI_API_KEY) &&\
	uvicorn src.main:app --reload


# Install frontend dependencies and start frontend
start-frontend:
	cd frontend && npm install && npm start


tag-backend:
	docker tag $(BACKEND_IMAGE_NAME) $(DOCKER_USER_NAME)/$(BACKEND_IMAGE_NAME):latest

tag-frontend:
	docker tag $(FRONTEND_IMAGE_NAME) $(DOCKER_USER_NAME)/$(FRONTEND_IMAGE_NAME):latest

push-backend:
	docker push $(DOCKER_USER_NAME)/$(BACKEND_IMAGE_NAME):latest

push-frontend:
	docker push $(DOCKER_USER_NAME)/$(FRONTEND_IMAGE_NAME):latest