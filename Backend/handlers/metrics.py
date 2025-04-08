from prometheus_flask_exporter import PrometheusMetrics
from prometheus_client import Counter, Histogram, Gauge, Summary
from flask import Flask, request
import psutil
import time
import random

# Define custom metrics
REQUEST_LATENCY = Histogram('flask_request_latency_seconds', 'Request latency (seconds)', ['endpoint', 'method'])
REQUEST_COUNT = Counter('flask_request_count', 'Request count', ['endpoint', 'method', 'http_status'])
EXCEPTION_COUNT = Counter('flask_exception_count', 'Count of exceptions', ['exception_type'])
DB_QUERY_LATENCY = Histogram('db_query_latency_seconds', 'Database query latency in seconds')
ACTIVE_USERS = Gauge('active_users', 'Current active users')

# Define CPU, Memory, and Network Metrics
CPU_USAGE = Gauge("flask_cpu_usage", "CPU usage of the application (in %)")
MEMORY_USAGE = Gauge("flask_memory_usage", "Memory usage of the application (in MB)")
NETWORK_SENT = Gauge("flask_network_sent", "Total network data sent (in MB)")
NETWORK_RECEIVED = Gauge("flask_network_received", "Total network data received (in MB)")

FRONTEND_LOAD_TIME = Summary('frontend_load_time_seconds', 'Frontend page load time reported from React')

# Store last cpu times and timestamp
last_cpu_times = {}
last_timestamps = {}

def get_process_cpu_percent(process):
    pid = process.pid
    now = time.time()

    # current CPU times
    current_cpu = process.cpu_times().user + process.cpu_times().system

    if pid in last_cpu_times:
        delta_proc = current_cpu - last_cpu_times[pid]
        delta_time = now - last_timestamps[pid]

        if delta_time > 0:
            cpu_percent = (delta_proc / delta_time) * 100 / psutil.cpu_count()
        else:
            cpu_percent = 0.0
    else:
        cpu_percent = 0.0

    last_cpu_times[pid] = current_cpu
    last_timestamps[pid] = now
    return cpu_percent

def update_system_metrics():
    """Update CPU, Memory, and Network metrics at the start of each request."""
    # CPU_USAGE.set(psutil.cpu_percent())
    process = psutil.Process()
    # CPU_USAGE.set(process.cpu_percent(interval=0.1)) # percore
    CPU_USAGE.set(get_process_cpu_percent(psutil.Process()))
    memory_mb = process.memory_info().rss / (1024 * 1024)  # RSS = Resident Set Size
    MEMORY_USAGE.set(memory_mb)
    # MEMORY_USAGE.set(psutil.virtual_memory().used / (1024 * 1024))

    net_io = psutil.net_io_counters()
    NETWORK_SENT.set(net_io.bytes_sent / (1024 * 1024))
    NETWORK_RECEIVED.set(net_io.bytes_recv / (1024 * 1024))

def setup_metrics(app):
    """Setup Prometheus metrics for monitoring Flask app performance."""
    metrics = PrometheusMetrics(app)

    @app.route('/frontend-metrics', methods=['POST'])
    def frontend_metrics():
        data = request.json
        load_time = data.get('loadTime')
        if load_time:
            try:
                FRONTEND_LOAD_TIME.observe(float(load_time))
            except Exception as e:
                EXCEPTION_COUNT.labels(exception_type=e.__class__.__name__).inc()
        return '', 204


    @app.before_request
    def start_timer():
        request.start_time = time.time()
        update_system_metrics()  # Update system metrics at the start of each request
        if random.random() < 0.001:
            raise Exception("Simulated error for testing purposes")

    @app.after_request
    def track_request(response):
        latency = time.time() - request.start_time
        endpoint = request.endpoint or "unknown"
        REQUEST_LATENCY.labels(endpoint=endpoint, method=request.method).observe(latency)
        REQUEST_COUNT.labels(endpoint=endpoint, method=request.method, http_status=response.status_code).inc()
        return response

    @app.errorhandler(Exception)
    def track_exceptions(e):
        EXCEPTION_COUNT.labels(exception_type=e.__class__.__name__).inc()
        raise e  # Preserve Flask's default exception handling

    @app.route("/metrics")
    def metrics_endpoint():
        return metrics

    return metrics
