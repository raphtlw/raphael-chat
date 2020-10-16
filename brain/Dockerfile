FROM python:3-slim-buster

WORKDIR /app
COPY . .
RUN pip install poetry
RUN poetry install

ENTRYPOINT [ "python", "brain" ]