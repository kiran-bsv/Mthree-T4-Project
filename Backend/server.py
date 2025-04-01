from app import app, db
from socket_handler import socketio
from prometheus_flask_exporter import PrometheusMetrics
import logging
from logging.handlers import RotatingFileHandler
import os
from flask import request
from sqlalchemy import event
from sqlalchemy.engine import Engine
import time
# import eventlet
# import eventlet.wsgi

# Set up Prometheus metrics
metrics = PrometheusMetrics(app)

@app.route("/metrics")
def metrics_endpoint():
    return metrics

# Set up logging for Loki
log_dir = 'logs'
if not os.path.exists(log_dir):
    os.makedirs(log_dir, exist_ok=True)
    os.chmod(log_dir, 0o777)  # Grant read, write, and execute permissions to all users

# Create a rotating log handler
log_handler = RotatingFileHandler('logs/app.log', maxBytes=1000000, backupCount=3)
log_handler.setLevel(logging.DEBUG)  # Capture everything from DEBUG level and above
log_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s in %(module)s: %(message)s'))

# Attach handler to Flask app logger
app.logger.setLevel(logging.DEBUG)  # Ensure Flask captures DEBUG logs
app.logger.addHandler(log_handler)
# Prevent duplicate logs in console
app.logger.propagate = False

# # Log to console as well
# console_handler = logging.StreamHandler()
# console_handler.setLevel(logging.DEBUG)
# console_handler.setFormatter(log_handler.formatter)
# app.logger.addHandler(console_handler)

# Log all incoming requests

SENSITIVE_KEYS = {"password", "pwd", "pass", "token", "secret", "api_key"}  # Add more if needed

def mask_sensitive_data(data):
    """Replace sensitive values with '****' in logs."""
    if isinstance(data, dict):  # JSON request body
        return {key: ("****" if key.lower() in SENSITIVE_KEYS else value) for key, value in data.items()}
    return data

@app.before_request
def log_request():
    start_time = time.time()
    sanitized_payload = None

    if request.method in ['POST', 'PUT', 'PATCH']:
        payload = request.get_json()
        if payload:
            sanitized_payload = mask_sensitive_data(payload)

    app.logger.info(f"➡️ Request: {request.method} {request.url} | "
                    f"IP: {request.remote_addr} | "
                    f"User-Agent: {request.user_agent} | "
                    f"📦 Payload: {sanitized_payload}")

    request.start_time = start_time

@app.after_request
def log_response(response):
    duration = time.time() - request.start_time
    app.logger.info(f"⬅️ Response: {response.status_code} | Time: {duration:.2f}s")
    return response

# Log unhandled exceptions automatically
@app.errorhandler(Exception)
def handle_exception(e):
    app.logger.error(f"Unhandled Exception: {str(e)}", exc_info=True)
    return {"error": "Something went wrong"}, 500

# Log all SQL queries (Optional, for debugging)
# ✅ Use SQLAlchemy event listeners to log queries
LOG_EVERY_NTH_QUERY = 10  # Log every 10th query
query_counter = 0

@event.listens_for(Engine, "before_cursor_execute")
def log_sql_queries(conn, cursor, statement, parameters, context, executemany):
    global query_counter
    query_counter += 1
    # Log only every Nth query to reduce noise
    if query_counter % LOG_EVERY_NTH_QUERY != 0:
        return  
    # Extract query type (INSERT, UPDATE, DELETE, etc.)
    query_type = statement.split()[0].upper()
    # Ignore SELECT queries (optional)
    if query_type == "SELECT":
        return  
    # Truncate long queries for readability
    truncated_query = statement[:200] + ("..." if len(statement) > 200 else "")
    app.logger.info(f"SQL [{query_type}]: {truncated_query} | Params: {parameters}")


if __name__ == 'server':
    with app.app_context():
        db.create_all()
    # socketio.run(app, debug=True, port=5000, host="0.0.0.0", use_reloader=False)
    # socketio.init_app(app, async_mode="eventlet")
    # eventlet.wsgi.server(eventlet.listen(("0.0.0.0", 5000)), app)
    app.logger.info("Starting Flask SocketIO App")
    socketio.run(app, port=5000)
    