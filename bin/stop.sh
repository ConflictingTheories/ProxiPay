#!/bin/bash
declare -x start = $(pwd)

# Spins up Docker Containers for Each Component
cd $start/nginx-lb
docker-compose down --rmi all

cd $start/payid-srv
docker-compose down --rmi all

cd $start/portal-srv
docker-compose down --rmi all

cd $start/xrpl-srv
docker-compose down --rmi all

cd $start