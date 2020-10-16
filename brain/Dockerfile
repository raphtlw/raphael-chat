FROM python:3-slim-buster

WORKDIR /app
COPY . .
RUN apt-get -qq update && apt-get -qq install gcc python3-dev
RUN pip install poetry
RUN poetry install --no-interaction --no-ansi

ENTRYPOINT [ "python", "brain" ]