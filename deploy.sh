#!/bin/bash

docker context use cluster
docker-compose up -d --build
