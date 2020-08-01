$start = $pwd

# Spins up Docker Containers for Each Component
Set-Location $start\nginx-lb
docker-compose up -d

Set-Location $start\payid-server
docker-compose up -d 

Set-Location $start\proxi-pay-portal
docker-compose up -d

Set-Location $start