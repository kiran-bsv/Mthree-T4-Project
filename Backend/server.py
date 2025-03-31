from app import app, db
from socket_handler import socketio
from prometheus_flask_exporter import PrometheusMetrics
import logging
from logging.handlers import RotatingFileHandler
import os
# import eventlet
# import eventlet.wsgi

# Set up Prometheus metrics
metrics = PrometheusMetrics(app)

# Set up logging for Loki
if not os.path.exists('logs'):
    os.makedirs('logs')

log_handler = RotatingFileHandler('logs/app.log', maxBytes=1000000, backupCount=3)
log_handler.setLevel(logging.INFO)
log_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s: %(message)s'))
app.logger.addHandler(log_handler)


if __name__ == 'server':
    with app.app_context():
        db.create_all()
    # socketio.run(app, debug=True, port=5000, host="0.0.0.0", use_reloader=False)
    # socketio.init_app(app, async_mode="eventlet")
    # eventlet.wsgi.server(eventlet.listen(("0.0.0.0", 5000)), app)
    app.logger.info("Starting Flask SocketIO App")
    socketio.run(app, port=5000)
    