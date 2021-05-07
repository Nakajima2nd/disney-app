FROM python:3
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH="/code/disneyapp/"
RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN pip install -r requirements.txt