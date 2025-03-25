from app import app, db
from socket_handler import socketio
# import eventlet
# import eventlet.wsgi

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    # socketio.run(app, debug=True, port=5000, host="0.0.0.0", use_reloader=False)
    # socketio.init_app(app, async_mode="eventlet")
    # eventlet.wsgi.server(eventlet.listen(("0.0.0.0", 5000)), app)
    socketio.run(app, port=5000)
    