#!/bin/bash

# fetch data
rm -rf data
wget https://github.com/igarashi339/disney-network/releases/download/1.2.0/data.zip
unzip data.zip
rm data*.zip