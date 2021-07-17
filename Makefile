# すべてのサービスを起動
.PHONY: up
up:
	docker-compose up -d

# すべてのサービスを停止
.PHONY: down
down:
	docker-compose down

# キャッシュを削除してビルドする
.PHONY: build
build:
	docker-compose build --no-cache

# すべてのコンテナとイメージを削除する
.PHONY: delete-all
delete-all:
	docker-compose down --rmi all --volumes

# フロントエンドのコンテナに入る
.PHONY: front-sh
front-sh:
	docker-compose exec frontend bash

# nodemodulesを手元にコピーする(エディターの補完を効かせるため)
.PHONY: copy
copy:
	sudo docker cp disney-app_frontend_1:/code/node_modules ./frontend/