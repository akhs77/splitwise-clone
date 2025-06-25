# FROM python:3.11-slim

# # Set the working directory inside the container
# WORKDIR /app

# # Copy app source code into the container
# COPY ./app /app/app
# COPY requirements.txt .

# # Optional: let Python see the nested app
# ENV PYTHONPATH=/app

# # Install Python dependencies
# RUN pip install --no-cache-dir -r requirements.txt

# # Expose FastAPI default port
# EXPOSE 8000

# # Start the FastAPI server
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]


FROM python:3.11-slim

WORKDIR /app

COPY . .

ENV PYTHONPATH=/app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]