$start = $pwd

# Spins up Docker Containers for Each Component

# Load Balancer (Public Facing)
Set-Location $start\nginx-lb
docker-compose up -d

# PayID Server 
Set-Location $start\payid-server
docker build . -t payid
docker-compose up -d 

# Proxi Payment Portal / Dashboard
Set-Location $start\proxi-pay-portal
docker build . -t proxi-pay
docker-compose up -d

# XRP Ripple Node (Lite)
Set-Location $start\xrpl-server
docker build . -t xrpl
docker-compose up -d

Set-Location $start