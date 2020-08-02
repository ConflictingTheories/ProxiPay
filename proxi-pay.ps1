$start = $pwd

# Spins up Docker Containers for Each Component
Set-Location $start\nginx-lb
docker-compose up -d

Set-Location $start\payid-server
docker build . -t payid
docker-compose up -d 

Set-Location $start\proxi-pay-portal
docker build . -t proxi-pay
docker-compose up -d

Set-Location $start\xrpl-server
docker build . -t xrpl
docker-compose up -d

Set-Location $start