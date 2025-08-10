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
# Bind to the PORT provided by the platform and use sane defaults for concurrency/timeouts.
# Preload the app so the listener only comes up once the app is imported, reducing cold-start 502s.

ENV WEB_CONCURRENCY=1 \
    GUNICORN_THREADS=2 \
    GUNICORN_TIMEOUT=60 \
    GUNICORN_KEEP_ALIVE=10

CMD ["sh", "-c", "exec poetry run gunicorn wsgi:app --workers ${WEB_CONCURRENCY:-1} --threads ${GUNICORN_THREADS:-2} --timeout ${GUNICORN_TIMEOUT:-60} --keep-alive ${GUNICORN_KEEP_ALIVE:-10}"]
