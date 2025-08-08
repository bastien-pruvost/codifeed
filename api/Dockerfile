# Use the Python 3 official image
# https://hub.docker.com/_/python
FROM python:3.13-slim

# Run in unbuffered mode
ENV PYTHONUNBUFFERED=1

# Create and change to the app directory.
WORKDIR /app

# Copy local code to the container image.
COPY . /app

# Install poetry
RUN pip install --no-cache-dir "poetry>=2.0.0,<3.0.0"

# Install project dependencies
RUN poetry install --no-root

# Run the web service on container startup.

CMD ["sleep", "5", ";", "poetry", "run", "gunicorn", "wsgi:app"]
