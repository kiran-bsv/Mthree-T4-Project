from flask_socketio import SocketIO, emit, join_room, leave_room
from flask import request
from database_handler.database_handler import db
from models.user_model import User
from models.captain_model import Captain
from app import app 

socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('connect')
def handle_connect():
    print(f"Client connected: {request.sid}")

@socketio.on('join')
def handle_join(data):

    user_id = data.get("userId")
    user_type = data.get("userType")

    if not user_id or not user_type:
        print(" Invalid userId or userType:", data)
        return

    if user_type == "user":
        user = User.query.get(user_id)
        if user:
            user.socket_id = request.sid
            db.session.commit()
            print(f"User {user.id} connected with socket ID: {request.sid}")
        else:
            print(f"User with ID {user_id} not found")

    elif user_type == "captain":
        captain = Captain.query.get(user_id)
        if captain:
            captain.socket_id = request.sid
            db.session.commit()
            print(f"Captain {captain.id} connected with socket ID: {request.sid}")
        else:
            print(f"Captain with ID {user_id} not found")

@socketio.on('update-location-captain')
def update_location(data):
    user_id = data.get("userId")
    location = data.get("location")

    if not location or "ltd" not in location or "lng" not in location:
        emit('error', {"message": "Invalid location data"})
        return

    captain = Captain.query.get(user_id)
    if captain:
        captain.location_lat = location["ltd"]
        captain.location_lng = location["lng"]
        db.session.commit()

@socketio.on('disconnect')
def handle_disconnect():
    print(f"Client disconnected: {request.sid}")

def send_message_to_socket_id(socket_id, event, data):
    if socketio:
        socketio.emit(event, data, room=socket_id)
    else:
        print("SocketIO not initialized.")
