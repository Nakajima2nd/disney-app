#!/bin/bash
heroku logout
source scripts/.env
expect -c "
  set timeout 3
  spawn heroku login --interactive
  expect \"Email: \"
  send $HEROKU_EMAIL
  send \"\r\"
  expect \"Password: \"
  send $HEROKU_PASSWORD
  sleep 1
  send \"\r\"
  interact
"