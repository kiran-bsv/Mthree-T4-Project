from sqlalchemy import event
from sqlalchemy.engine import Engine

LOG_EVERY_NTH_QUERY = 10  # Log every 10th query
query_counter = 0

def setup_sql_logging(app, db):
    @event.listens_for(Engine, "before_cursor_execute")
    def log_sql_queries(conn, cursor, statement, parameters, context, executemany):
        global query_counter
        query_counter += 1
        if query_counter % LOG_EVERY_NTH_QUERY != 0:
            return  

        query_type = statement.split()[0].upper()
        if query_type == "SELECT":
            return  

        truncated_query = statement[:200] + ("..." if len(statement) > 200 else "")
        app.logger.info(f"SQL [{query_type}]: {truncated_query} | Params: {parameters}")
