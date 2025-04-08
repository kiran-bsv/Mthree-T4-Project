import time
import json
from flask import request

SENSITIVE_KEYS = {"password", "token", "api_key"}

def mask_sensitive_data(data):
    return {k: "****" if k.lower() in SENSITIVE_KEYS else v for k, v in data.items()} if isinstance(data, dict) else data

def setup_middleware(app):
    @app.before_request
    def log_request():
        request.start_time = time.time()
        sanitized_payload = (
            mask_sensitive_data(request.get_json()) if request.method in ["POST", "PUT", "PATCH"] else None
        )
        log_data = {
            "direction": "in",
            "method": request.method,
            "url": request.url,
            "ip": request.remote_addr,
            "payload": sanitized_payload
        }
        app.logger.info(json.dumps(log_data))

    @app.after_request
    def log_response(response):
        duration = time.time() - request.start_time
        log_data = {
            "direction": "out",
            "method": request.method,
            "url": request.url,
            "status": response.status_code,
            "duration": round(duration, 2)
        }
        app.logger.info(json.dumps(log_data))
        return response

    @app.errorhandler(Exception)
    def handle_exception(e):
        log_data = {
            "level": "error",
            "method": request.method,
            "url": request.url,
            "message": str(e)
        }
        app.logger.error(json.dumps(log_data))
        return {"error": "Something went wrong"}, 500
