import random

# List of places with their corresponding lat, long (randomized integers for simplicity)
places = {
    "New York": [40, -74],
    "Los Angeles": [34, -118],
    "Chicago": [41, -87],
    "Houston": [29, -95],
    "Phoenix": [33, -112],
    "Philadelphia": [39, -75],
    "San Antonio": [29, -98],
    "San Diego": [32, -117],
    "Dallas": [32, -96],
    "San Jose": [37, -121],
    "Austin": [30, -97],
    "Jacksonville": [30, -81],
    "San Francisco": [37, -122],
    "Columbus": [39, -83],
    "Indianapolis": [39, -86],
    "Fort Worth": [32, -97],
    "Charlotte": [35, -80],
    "Seattle": [47, -122],
    "Denver": [39, -104],
    "Washington": [38, -77],
    "Warangal" : [17, 17],
}

# Number of places (Grid size)
m = len(places)

# Generate a sparse adjacency matrix with random distances (in km)
adj_matrix = {i: {} for i in range(m)}

# Randomly assign distances between some connected places
for i in range(m):
    for j in range(i + 1, m):
        if random.random() < 0.3:  # 30% probability of a direct connection
            distance = random.randint(7, 15)  # Random distance in km
            adj_matrix[i][j] = distance
            adj_matrix[j][i] = distance  # Ensure symmetry

