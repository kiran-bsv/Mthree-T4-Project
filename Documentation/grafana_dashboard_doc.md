# Grafana Dashboard Documentation for Flask Application Monitoring in Kubernetes

---

### What is Grafana?
Grafana is an open-source analytics and interactive visualization web application. It provides charts, graphs, and alerts for the web when connected to supported data sources. Grafana is commonly used for monitoring time-series data from infrastructure, applications, and IoT devices.

---

### Why We Are Using Grafana
We use Grafana in this setup to monitor a Flask-based application deployed in Kubernetes. Grafana provides:
- Real-time visibility into application performance
- Monitoring of resource usage (CPU, Memory, Network)
- Easy-to-understand visual dashboards
- Alerting and data correlation capabilities

It helps us to quickly identify performance bottlenecks, anomalies, and usage patterns.

---

### Data Sources
The data source for this Grafana dashboard is Prometheus. Prometheus collects metrics from various Kubernetes pods and services and stores them in a time-series database. Grafana connects to Prometheus to pull metrics using PromQL (Prometheus Query Language).

---

### Panels and Query Descriptions

#### Panel 1: **Network Sent and Received**
- **Title**: Network Sent and Received
- **Query**:
  - `flask_network_received`
  - `flask_network_sent`
- **Why this query?**
  - These metrics show how much data is being received and sent by the Flask application pod over the network.
  - Helps to monitor bandwidth usage and detect unexpected spikes in traffic.
- **Significance**:
  - Useful for identifying data transmission issues or DoS attacks.
  - Helps in scaling decisions if network traffic consistently exceeds a threshold.
- **Panel Options**:
  - **Type**: Graph (Time series)
  - **Legend**: Metric labels
  - **X-Axis**: Time
  - **Y-Axis**: Network Data (in bytes or bits)
  - **Color**: Custom series color for differentiation

---

#### Panel 2: **Memory Usage**
- **Title**: Memory Usage
- **Query**:
  - `rate(flask_memory_usage[1m])`
- **Why this query?**
  - `rate()` function computes how quickly memory usage is changing.
  - Helps in detecting memory leaks or sudden spikes in usage.
- **Significance**:
  - Key to monitoring memory performance over time.
  - Can alert when memory usage grows too fast.
- **Panel Options**:
  - **Type**: Graph
  - **Legend**: Pod/Container labels
  - **X-Axis**: Time
  - **Y-Axis**: Rate of Memory Usage (bytes/sec)

---

#### Panel 3: **Database Query Latency**
- **Title**: Database Query Latency
- **Query**:
  - `rate(db_query_latency_seconds_sum[1m])`
- **Why this query?**
  - Measures the sum of latency over time for database queries.
  - Rate gives the average response time per second.
- **Significance**:
  - Crucial for understanding database responsiveness.
  - Helps to identify slow queries or degraded performance.
- **Panel Options**:
  - **Type**: Graph
  - **Legend**: Query label or operation
  - **X-Axis**: Time
  - **Y-Axis**: Latency (seconds)

---

#### Panel 4: **Active Users**
- **Title**: Active Users
- **Query**:
  - `active_users`
- **Why this query?**
  - Displays the number of currently active users using the Flask app.
- **Significance**:
  - Helps measure user load and engagement.
  - Useful for planning scaling operations.
- **Panel Options**:
  - **Type**: Gauge
  - **Min/Max**: Set based on expected user load (e.g., 0 - 1000)
  - **Color Zones**: Green, Yellow, Red for normal/high/critical user load

---

#### Panel 5: **Flask Request Count**
- **Title**: Flask Request Count
- **Query**:
  - `flask_request_count_total{method="GET"}`
- **Why this query?**
  - Tracks how many GET requests have been made to the Flask app.
  - Focuses on GET requests which are the most common.
- **Significance**:
  - Useful for traffic monitoring.
  - Helps in understanding application usage patterns.
- **Panel Options**:
  - **Type**: Stat panel
  - **Value**: Total request count
  - **Color**: Dynamic thresholds for traffic spikes

---

#### Panel 6: **CPU Usage**
- **Title**: CPU Usage
- **Query**:
  - `flask_cpu_usage`
- **Why this query?**
  - Monitors the CPU utilization of the Flask container or pod.
- **Significance**:
  - Critical for performance tuning and capacity planning.
  - High CPU usage can degrade app responsiveness.
- **Panel Options**:
  - **Type**: Graph
  - **Y-Axis**: CPU units (millicores or percentage)
  - **Color**: Usage levels (normal/warning/critical)

---

