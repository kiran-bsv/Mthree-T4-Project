import os
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

db = SQLAlchemy()

def connect_to_db(app):
    db_uri = os.getenv("DB_CONNECT")
    if not db_uri:
        raise ValueError("Database connection string (DB_CONNECT) is missing in .env file")

    app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
    db.init_app(app)
    print("✅ Connected to DB")
