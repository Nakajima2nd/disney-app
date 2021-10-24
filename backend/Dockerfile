FROM python:3
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH="/code/disneyapp/:/code/test/search"
RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN pip install -r requirements.txt