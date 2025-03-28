import requests
from models.captain_model import Captain
from models.grid import m,adj_matrix
from services.grid_service import get_node, dijkstra, get_place

# GOOGLE_MAPS_API = os.getenv("GOOGLE_MAPS_API")  # ✅ Load Google Maps API key

def get_address_coordinates(address):
    """Fetch latitude and longitude of an address using Google Maps API."""
    if not address:
        raise ValueError("Address is required")

    return {"lat": 16.9525, "lng": 81.7881}  

    # url = f"https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={GOOGLE_MAPS_API}"
    
    # try:
    #     response = requests.get(url)
    #     data = response.json()

    #     if data.get("status") == "OK":
    #         location = data["results"][0]["geometry"]["location"]
    #         return {"lat": location["lat"], "lng": location["lng"]}
    #     else:
    #         raise ValueError("Unable to fetch coordinates")
    
    # except requests.exceptions.RequestException as e:
    #     print(f"Error fetching coordinates: {e}")
    #     raise

def get_distance_time(origin, destination, avg_speed=60):
    """Fetch distance and travel time between two locations."""
    if not origin or not destination:
        raise ValueError("Origin and destination are required")

    # url = f"https://maps.googleapis.com/maps/api/distancematrix/json?origins={origin}&destinations={destination}&key={GOOGLE_MAPS_API}"

    # try:
    #     response = requests.get(url)
    #     data = response.json()

    #     if data.get("status") == "OK":
    #         return {"distance": data["rows"][0]["elements"][0]["distance"]["text"], "duration": data["rows"][0]["elements"][0]["duration"]["text"]}
    #     else:
    #         raise ValueError("Unable to fetch distance and time")
    
    # except requests.exceptions.RequestException as e:
    #     print(f"Error fetching distance and time: {e}")
    #     raise
    start = get_node(origin)
    end = get_node(destination)

    if start not in adj_matrix or end not in adj_matrix:
        return {"error": "Invalid start or end location"}

    distance, path = dijkstra(start, end)
    duration_hours = distance / avg_speed

    return {
        "distance": round(distance, 2),
        "duration": round(duration_hours, 2),
        "path": path
    }

    # # Convert distance to time (Assuming speed in km/h)
    # duration_hours = distance / avg_speed
    # # duration = f"{int(duration_hours)} hours {int((duration_hours * 60) % 60)} minutes"
    # duration = f"{duration_hours:.2f}"

    # return {"distance": f"{distance:.2f}", "duration": f"{duration}", "path": path}
    # return {"distance": "100 km", "duration": "2 hours"}

def get_auto_complete_suggestions(input_text):
    """Fetch location autocomplete suggestions using Google Places API."""
    if not input_text:
        raise ValueError("Query is required")

    # url = f"https://maps.googleapis.com/maps/api/place/autocomplete/json?input={input_text}&key={GOOGLE_MAPS_API}"

    try:
        if(True):
            resultArray = ["New York, NY, USA", "New Delhi, India", "New Orleans, LA, USA"]
            return resultArray
        else:
            raise ValueError("Unable to fetch suggestions")
        
    #     response = requests.get(url)
    #     data = response.json()

    #     if data.get("status") == "OK":
    #         return [prediction["description"] for prediction in data["predictions"]]
    #     else:
    #         raise ValueError("Unable to fetch suggestions")
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching suggestions: {e}")
        raise
    # hardcoded_suggestions = {
    #     "New": ["New York, NY, USA", "New Delhi, India", "New Orleans, LA, USA"],
    #     "Hyder": ["Hyderabad, India", "Hyderabad, Pakistan"],
    #     "Banga": ["Bangalore, India", "Bangladesh"],
    #     "Chenn": ["Chennai, India", "Chennai International Airport"]
    # }

    # return hardcoded_suggestions.get(input_text[:5], ["Place A", "Place B", "Place C"])
    # return ["New York, NY, USA", "New Delhi, India", "New Orleans, LA, USA"]

# def get_captains_in_radius(ltd, lng, radius):
#     """Find all captains within a given radius (dummy implementation)."""
#     captains = Captain.query.all()  # Replace with actual spatial query using SQLAlchemy
#     return [{"id": c.id, "ltd": c.location_ltd, "lng": c.location_lng} for c in captains]

def get_captains_in_radius(lat, lng, radius):
    """Fetch all captains (ignoring radius for now)."""

    captains = Captain.query.all()

    captain_list = [
        {
            "id": c.id,
            "lat": c.location_lat,
            "lng": c.location_lng,
            "socket_id": c.socket_id
        }
        for c in captains if c.socket_id
    ]

    return captain_list
