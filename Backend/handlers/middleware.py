import time
from flask import request

SENSITIVE_KEYS = {"password", "token", "api_key"}

def mask_sensitive_data(data):
    return {k: "****" if k.lower() in SENSITIVE_KEYS else v for k, v in data.items()} if isinstance(data, dict) else data

def setup_middleware(app):
    @app.before_request
    def log_request():
        request.start_time = time.time()
        sanitized_payload = mask_sensitive_data(request.get_json()) if request.method in ["POST", "PUT", "PATCH"] else None
        app.logger.info(f"➡️ {request.method} {request.url} | IP: {request.remote_addr} | Payload: {sanitized_payload}")

    @app.after_request
    def log_response(response):
        duration = time.time() - request.start_time
        app.logger.info(f"⬅️ {request.method} {request.url} [{response.status_code}] - {duration:.2f}s")
        return response

    @app.errorhandler(Exception)
    def handle_exception(e):
        app.logger.error(f"❌ Error [{request.method} {request.url}]: {str(e)}")
        return {"error": "Something went wrong"}, 500
