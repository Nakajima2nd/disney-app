#!/bin/bash

# fetch data
rm -rf data
wget https://github.com/igarashi339/disney-network/releases/download/1.1.0/data.zip
unzip data.zip
rm data*.zip

# run server
python manage.py runserver 0:8000