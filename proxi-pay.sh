#!/bin/bash

docker-compose \
    -f nginx-lb/docker-compose.yaml \
    -f payid-server/docker-compose.yaml \
    -f proxi-pay-portal/docker-compose.yaml \
    up -d
