FROM python:3
RUN curl https://cli-assets.heroku.com/install.sh | sh
RUN apt-get update
RUN apt-get install -y postgresql postgresql-contrib expect
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH="/code/disneyapp/"
RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN pip install -r requirements.txt