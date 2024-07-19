# Backend
## 1. Docker

Prerequisites: Docker installed on your machine. You can download and install Docker from [here](https://www.docker.com/products/docker-desktop).

```
cd backend
docker build -t backend-fastapi .
docker run -d -p 8000:8000 backend-fastapi
```
Access the application via: http://0.0.0.0:8000/docs


## 2. Run it locally 
```
cd backend
export PYTHONPATH=$(pwd)
export OPENAI_API_KEY=<your_key>
cd src
uvicorn main:app --reload
```