FROM python:3.7-slim-buster

WORKDIR /app
COPY . .

RUN apt-get -qq update && apt-get -qq install gcc g++ python3-dev pkg-config curl
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
ENV PATH="/root/.cargo/bin:${PATH}"
RUN pip install poetry
RUN poetry install --no-interaction --no-ansi

ENTRYPOINT [ "python", "brain" ]