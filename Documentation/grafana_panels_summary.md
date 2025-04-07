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
### Link to Site Reliability Engineering (SRE)
Grafana plays a vital role in SRE practices by supporting:

Monitoring: One of the pillars of SRE, Grafana helps in tracking system performance and user experience through dashboards.

Alerting and Incident Response: Enables setting up alert rules and thresholds based on SLOs and SLIs, essential for error budgeting and incident response.

Observability: Grafana supports observability by allowing deep insights into logs, metrics, and traces, helping engineers debug issues faster.

SLO Compliance: Dashboards can display compliance with Service Level Objectives, which helps ensure systems meet reliability goals.

Grafana empowers SRE teams to maintain service reliability and improve system performance with real-time observability tools.


---

## 1. User Latency Metrics (Panel ID: 11)
```promql
flask_request_latency_seconds_sum{endpoint=~"^user\\..*", method!="OPTIONS"}
```
**Query Options:**
- Format: heatmap
- Instant: true
- Range: false
- Legend Format: {{endpoint}}

**Panel Options:**
- Display Mode: gradient
- Orientation: horizontal
- Value Mode: color
- Show Unfilled: true
- Reduce Options: mean calculation

**Used:**
    Helps identify slow endpoints in user-related API calls. Excluding OPTIONS avoids irrelevant preflight requests.


**Significance:**
 Tracks cumulative request latency for user-related endpoints.

---

## 2. Payments & Ratings Latency (Panel ID: 13)
```promql
# Query A
flask_request_latency_seconds_sum{endpoint=~"^payments\\..*", method!="OPTIONS"}
# Query B
flask_request_latency_seconds_sum{endpoint=~"^ratings\\..*", method!="OPTIONS"}
```
**Query Options:**
- Query A: Instant: true, Range: false
- Query B: Instant: false, Range: true
- Legend Format: {{endpoint}}

**Panel Options:**
- Orientation: auto
- Reduce Options: mean calculation
- Show Threshold Labels: false
- Show Threshold Markers: true


**Why Used:**
       These are critical parts of the app—slow payments or ratings degrade UX. Separate queries aid in pinpointing the problem area.


**Significance:**
       Measures latency in payments and ratings services separately.



---

## 3. Active Users (Panel ID: 5)
```promql
active_users
```
**Query Options:**
- Range: true
- Legend Format: __auto

**Panel Options:**
- Orientation: auto
- Reduce Options: lastNotNull calculation
- Show Threshold Labels: false
- Show Threshold Markers: true

**Why Used:**
   Direct insight into app usage and user engagement in real time.


**Significance:**
    Tracks the number of currently active users.






---

## 4. Captain Latency Metrics (Panel ID: 12)
```promql
flask_request_latency_seconds_sum{endpoint=~"^captain\\..*", method!="OPTIONS"}
```
**Query Options:**
- Format: heatmap
- Instant: true
- Range: false
- Legend Format: {{endpoint}}

**Panel Options:**
- Display Mode: gradient
- Orientation: horizontal
- Value Mode: color
- Show Unfilled: true
- Reduce Options: mean calculation

**Why Used:**
    Monitoring captain performance ensures both ends of the user base (customer and captain) are optimized.



**Significance:**
    Shows latency for captain-facing endpoints (e.g., for delivery drivers).



---

## 5. Request Count (Panel ID: 10)
```promql
sum by(endpoint) (flask_request_count_total{method!="OPTIONS", endpoint!="prometheus_metrics"})
```
**Query Options:**
- Format: time_series
- Instant: true
- Range: false
- Legend Format: __auto

**Panel Options:**
- Bar Radius: 0.2
- Bar Width: 0.59
- Group Width: 0.83
- Orientation: auto
- Stacking: none
- Legend Placement: right


**Why Used:**
       Useful for traffic analysis and spotting overused/underused routes. Ignores non-app endpoints.


**Significance:**
       Counts requests to each endpoint, aggregated by endpoint name.



---

## 6. Network Data Received (Panel ID: 9)
```promql
rate(flask_network_received[5m])
```
**Query Options:**
- Range: true
- Legend Format: __auto

**Panel Options:**
- Legend Placement: bottom
- Tooltip Mode: single
- Line Interpolation: linear
- Fill Opacity: 17
- Gradient Mode: none

**Why Used:**
    Ensures network input is within expected bounds—helps catch abnormal usage or attacks.


**Significance:**
       Tracks incoming network data to the app over time.



---

## 7. Ride Latency Metrics (Panel ID: 2)
```promql
flask_request_latency_seconds_sum{endpoint=~"^rides\\..*", method!="OPTIONS"}
```
**Query Options:**
- Format: heatmap
- Instant: true
- Range: false
- Legend Format: {{endpoint}}

**Panel Options:**
- Display Mode: gradient
- Orientation: horizontal
- Value Mode: color
- Show Unfilled: true
- Reduce Options: mean calculation


**Why Used:**
    Rides are core business logic. Monitoring ensures ride booking and tracking are performant.



**Significance:**
       Measures latency for ride-related operations.





---

## 8. Network Data Sent (Panel ID: 8)
```promql
rate(flask_network_sent[5m])
```
**Query Options:**
- Range: true
- Legend Format: __auto

**Panel Options:**
- Legend Placement: bottom
- Tooltip Mode: single
- Line Interpolation: linear
- Fill Opacity: 19
- Gradient Mode: hue


**Why Used:** 
         Helps identify data-heavy operations and possible inefficiencies in response payloads.

**Significance:**
       Tracks outgoing data rate.






---

## 9. CPU Usage Rate (Panel ID: 6)
```promql
rate(flask_cpu_usage[5m])
```
**Query Options:**
- Range: true
- Legend Format: __auto

**Panel Options:**
- Legend Placement: bottom
- Tooltip Mode: single
- Line Interpolation: linear
- Fill Opacity: 13
- Gradient Mode: hue

**Why Used:**
    Ensures the application isn't CPU-bound or facing compute bottlenecks.


**Significance:**
       Measures how much CPU the app is consuming.

---

## 10. Memory Usage (Panel ID: 7)
```promql
flask_memory_usage
```
**Query Options:**
- Range: true
- Legend Format: __auto

**Panel Options:**
- Legend Placement: bottom
- Tooltip Mode: single
- Line Interpolation: linear
- Fill Opacity: 0
- Gradient Mode: none


**Why Used:**
    Helps detect memory leaks and high usage trends that might require scaling or optimization.



**Significance:**
    Displays the app’s memory consumption.


---

## 11. Error Rate (Panel ID: 4)
```promql
rate(flask_request_count{http_status="500"}[5m])
```
**Query Options:**
- Range: true
- Legend Format: __auto

**Panel Options:**
- Legend Placement: bottom
- Tooltip Mode: single
- Line Interpolation: linear
- Fill Opacity: 0
- Gradient Mode: none


**Why Used:**
       A direct indicator of app health. Spikes in this metric signal critical backend issues.



**Significance:**
       Measures the rate of internal server errors (HTTP 500).




---

