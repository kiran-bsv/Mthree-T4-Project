import logging
from logging.handlers import RotatingFileHandler
import os
from config import config

def setup_logging(app):
    log_dir = config.LOG_DIR
    os.makedirs(log_dir, exist_ok=True)
    os.chmod(log_dir, 0o777)

    log_handler = RotatingFileHandler(f"{log_dir}/app.log", maxBytes=1_000_000, backupCount=3)
    log_handler.setLevel(logging.DEBUG)
    log_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s: %(message)s'))

    app.logger.setLevel(logging.DEBUG)
    app.logger.addHandler(log_handler)
    app.logger.propagate = False  # Prevent duplicate logs
