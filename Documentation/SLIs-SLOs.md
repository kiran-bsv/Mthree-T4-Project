# SLIs and SLOs in Uber Clone Backend

## What are SLIs and SLOs?

**SLI (Service Level Indicator):** A metric that indicates how well a service is performing. Examples include request latency, success rate, and error rate.

**SLO (Service Level Objective):** A target value or range for a given SLI. It represents a commitment to the level of service.

---

## SLIs Defined in the Project

The following SLIs are collected using Prometheus and `prometheus_flask_exporter`:

### 1. **Request Latency**
- **Metric Used:** `flask_request_latency_seconds`
- **Purpose:** Measures how long the server takes to respond to different endpoints.
- **Example Endpoint:** `POST /user/signup`

### 2. **Request Success Rate**
- **Metric Used:** `flask_request_count` (filtered by HTTP status code)
- **Purpose:** Calculates the percentage of requests resulting in 2xx responses.
- **Example Endpoint:** `GET /ride/history`

### 3. **Error Rate**
- **Metric Used:** `flask_exception_count`
- **Purpose:** Tracks how many requests failed due to server-side exceptions.
- **Example Endpoint:** `POST /ride/book` (e.g., failed booking due to internal error)

### 4. **Database Query Latency**
- **Metric Used:** `db_query_latency_seconds`
- **Purpose:** Measures time taken to complete DB operations.
- **Example:** Measuring DB latency during `POST /payment/complete`.

### 5. **System Metrics**
- **Metrics Used:**
  - `flask_cpu_usage`
  - `flask_memory_usage`
  - `flask_network_sent`
  - `flask_network_received`
- **Purpose:** System-level indicators impacting backend performance.

### 6. **Active Users**
- **Metric Used:** `active_users`
- **Purpose:** Gauge showing number of current active users.

---

## Sample SLOs (Service Level Objectives)

Here are the targets defined for our SLIs to ensure reliable performance:

### 1. **Signup Latency (POST /user/signup)**
- **SLO:** 95% of requests should complete in < 300ms.
- **SLI Tracked:** `flask_request_latency_seconds{endpoint="signup"}`

### 2. **Ride Booking Reliability (POST /ride/book)**
- **SLO:** 99% of booking requests should return HTTP 2xx.
- **SLI Tracked:** `flask_request_count{endpoint="ride.book", http_status=~"2.."}`

### 3. **Ride Booking Error Rate**
- **SLO:** < 0.1% of ride bookings should result in server-side errors.
- **SLI Tracked:** `flask_exception_count{exception_type!=""}`

### 4. **DB Latency During Payment Completion (POST /payment/complete)**
- **SLO:** 90% of DB queries during payment should complete in < 100ms.
- **SLI Tracked:** `db_query_latency_seconds`

### 5. **System Resource Usage**
- **SLO:**
  - CPU usage < 85% for 99% of the time.
  - Memory usage < 500MB for 99% of the time.

---

## 🔍 Example Use Cases

### Monitoring Ride Booking Flow:
- Use `flask_request_latency_seconds` and `flask_exception_count` for `/ride/confirm` to ensure fast and error-free booking experience.

### Signup Traffic Monitoring:
- Track latency spikes in `/user/signup` to handle backend bottlenecks.

### System Health During Peak Hours:
- Use `flask_cpu_usage` and `flask_memory_usage` to auto-scale services if CPU or memory crosses thresholds.

---

##  Conclusion
By defining SLIs and setting SLOs, we can proactively monitor our service performance, improve user experience, and take action before users are affected.
Tracking these SLIs and maintaining the defined SLOs ensures a reliable, fast, and smooth ride experience for users and captains.
