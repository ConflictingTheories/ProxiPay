$start = $pwd

# Spins up Docker Containers for Each Component

# PayID Server 
Set-Location $start\payid-srv
docker-compose down --rmi all

# Proxi Payment Portal / Dashboard
Set-Location $start\portal-srv
docker-compose down --rmi all

# XRP Ripple Node (Lite)
Set-Location $start\xrpl-srv
docker-compose down --rmi all

# Load Balancer (Public Facing)
Set-Location $start\nginx-lb
docker-compose down --rmi all

Set-Location $start