from app import app, db
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from handlers.logging_config import setup_logging
from handlers.metrics import setup_metrics
from handlers.middleware import setup_middleware
from handlers.sql_logger import setup_sql_logging
from socket_handler import socketio
from config import config

app.config.from_object(config)

# Initialize Modules
setup_logging(app)
setup_metrics(app)
setup_middleware(app)
setup_sql_logging(app, db)
# setup_sockets(app)

if __name__ == "server":
    with app.app_context():
        db.create_all()
