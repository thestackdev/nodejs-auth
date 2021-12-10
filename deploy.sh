#/bin/bash

echo 'Deploy started...'
rsync -av --exclude='node_modules' --exclude='.git' ../nodejs-auth/ ubuntu@152.70.74.152:~/projects/Auth
ssh ubuntu@152.70.74.152 "cd ~/projects/Auth && docker-compose up -d --build"
echo 'Deployed!'
