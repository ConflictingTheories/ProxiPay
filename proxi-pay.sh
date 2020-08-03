#!/bin/bash
declare -x start = $(pwd)

# Spins up Docker Containers for Each Component
cd $start/nginx-lb
docker-compose up -d

cd $start/payid-srv
docker build . -t payid
docker-compose up -d 

cd $start/portal-srv
docker build . -t proxi-pay
docker-compose up -d

cd $start/xrpl-srv
docker build . -t xrpl
docker-compose up -d 

cd $start