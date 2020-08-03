$start = $pwd

# Spins up Docker Containers for Each Component

# PayID Server 
Set-Location $start\payid-srv
docker build . -t payid
docker-compose up -d 

# Proxi Payment Portal / Dashboard
Set-Location $start\portal-srv
docker build . -t proxi-pay
docker-compose up -d

# XRP Ripple Node (Lite)
Set-Location $start\xrpl-srv
docker build . -t xrpl
docker-compose up -d

# Load Balancer (Public Facing)
Set-Location $start\nginx-lb
docker build . -t nginx
docker-compose up -d

Set-Location $start