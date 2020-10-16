FROM python:3-slim-buster

RUN apt install curl
RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -
WORKDIR /app
COPY . .
RUN poetry install

ENTRYPOINT [ "python", "brain" ]