#!/bin/bash
declare -x start = $(pwd)

# Spins up Docker Containers for Each Component
cd $start/nginx-lb
docker-compose up -d

cd $start/payid-server
docker build . -t payid
docker-compose up -d 

cd $start/proxi-pay-portal
docker build . -t proxi-pay
docker-compose up -d

cd $start/xrpl-server
docker build . -t xrpl
docker-compose up -d

cd $start