FROM python:3.9-slim-buster

WORKDIR /code

COPY requirements.txt /code/

RUN pip install -r requirements.txt

RUN apt-get update \
    && apt-get -y install libpq-dev gcc \
    && pip install psycopg2

COPY . /code/

WORKDIR /code/inst_back/

RUN chmod +x ./docker-entrypoint.sh

ENTRYPOINT ["/bin/bash", "-c", "./docker-entrypoint.sh"]