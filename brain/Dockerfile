FROM python:3.7-slim-buster

WORKDIR /app
COPY . .

RUN apt-get -qq update > /dev/null 2>&1 && \
    apt-get -qq install gcc g++ python3-dev pkg-config curl > /dev/null 2>&1
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"
RUN pip install poetry
RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi

EXPOSE 8080
ENTRYPOINT [ "python", "brain" ]