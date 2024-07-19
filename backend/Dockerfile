# backend/Dockerfile
FROM continuumio/miniconda3:latest

LABEL authors="willchien"

# Set the working directory
WORKDIR /app

# Copy the requirements.txt file
COPY src /app/src
COPY environment.yml .

# Create a conda environment and install dependencies
RUN conda env create -f environment.yml \
    && echo "source activate myenv" > ~/.bashrc \
    && conda clean --all -f -y

# Set the environment variables
ENV PYTHONPATH /app
ENV OPENAI_API_KEY <your_key>

# Expose the port FastAPI runs on
EXPOSE 8000

# Command to run the application
CMD ["bash", "-c", "source activate myenv && uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload"]
