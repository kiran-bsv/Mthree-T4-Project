import heapq
from models.grid import places, adj_matrix, m

# Convert place name to node index
def get_node(place):
    return list(places.keys()).index(place)

# Convert node index back to place name
def get_place(node):
    return list(places.keys())[node]

# Dijkstra's Algorithm for shortest path
def dijkstra(start, end):
    queue = [(0, start)]  # (distance, node)
    distances = {node: float('inf') for node in adj_matrix}
    distances[start] = 0
    prev_nodes = {node: None for node in adj_matrix}

    while queue:
        current_distance, current_node = heapq.heappop(queue)

        if current_node == end:
            break  # Found shortest path

        for neighbor, weight in adj_matrix.get(current_node, {}).items():
            new_distance = current_distance + weight
            if new_distance < distances[neighbor]:
                distances[neighbor] = new_distance
                prev_nodes[neighbor] = current_node
                heapq.heappush(queue, (new_distance, neighbor))

    # Reconstruct path
    path, node = [], end
    while node is not None:
        path.insert(0, node)
        node = prev_nodes[node]

    return distances[end], [get_place(p) for p in path]

# Get distance & time
def get_distance_time(place1, place2, avg_speed=80):
    start = get_node(place1)
    end = get_node(place2)

    if start not in adj_matrix or end not in adj_matrix:
        return {"error": "Invalid start or end location"}

    distance, path = dijkstra(start, end)

    # Convert distance to time (Assuming speed in km/h)
    duration_hours = distance / avg_speed
    duration = f"{int(duration_hours)} hours {int((duration_hours * 60) % 60)} minutes"

    return {"distance": f"{distance:.2f} km", "duration": duration, "path": path}

