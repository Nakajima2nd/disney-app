#!/bin/bash

# 起動中のすべてのコンテナを停止
docker ps -q | xargs docker stop

# すべてのコンテナを削除
docker container prune -f

# すべてのイメージを削除
docker images -q | xargs docker rmi