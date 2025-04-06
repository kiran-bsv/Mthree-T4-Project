# Toils in the Project & How We Reduced Them

Toils in the project are repetitive, manual tasks that don’t contribute long-term value. Here’s how we identified and automated or eliminated them:

| **Toil**                            | **Description**                                                                | **How We Reduced It**                                                                 |
|-------------------------------------|--------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| Manual Deployment                   | Deploying the backend manually every time a change was made.                   | Introduced **Jenkins CI/CD** pipeline with Docker and Kubernetes for automation.       |
| Manual Health Checks                | Regularly checking server health and performance manually.                     | Added **Prometheus + Grafana** for real-time monitoring and alerting.                  |
| Debugging Performance Issues        | Manually identifying slow endpoints or high error routes.                      | Used **custom metrics** (latency, exceptions) to trace and fix issues quickly.         |
| Resource Monitoring via SSH         | Manually logging into servers to check CPU/Memory/Network usage.               | Automated with **psutil-based system metrics exporters**.                              |
| No Automated Alerting               | Errors or resource spikes had to be discovered manually.                       | Integrated **alerts in Grafana dashboards** (e.g., high CPU or memory usage).          |
| Delayed Error Visibility            | Errors were seen only after manual inspection.                                 | Used **flask_exception_count** and Grafana for early visibility of issues.             |
| No Centralized Log Access           | Logs were only accessible via server CLI.                                      | Integrated **Loki + Promtail** for centralized logging and querying.                   |
| Static Infrastructure Configuration | Configuration was manually edited on servers.                                  | Used **Docker + Kubernetes configs** for repeatable, declarative infra setup.          |

---

These efforts significantly reduced operational overhead, improved system reliability, and allowed the team to focus on impactful development work.
