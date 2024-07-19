# Frontend
### Run the frontend with Docker

```
cd frontend
docker build -t frontend-react .
docker run -d -p 3000:3000 frontend-react
```
Access the application via: http://localhost:3000
