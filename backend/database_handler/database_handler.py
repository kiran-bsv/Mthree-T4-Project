import os
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

db = SQLAlchemy()

def connect_to_db(app):
    try:
        db_uri = os.getenv("DB_CONNECT")
        if not db_uri:
            raise ValueError("Database connection string (DB_CONNECT) is missing in .env file")

        # Configure SQLAlchemy settings
        app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
        app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
        app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
            "poolclass": QueuePool,
            "pool_size": 10,
            "max_overflow": 20,
            "pool_timeout": 30,
            "pool_recycle": 1800,  # Recycle connections after 30 minutes
        }
        
        # Initialize database
        db.init_app(app)
        
        # Test the connection
        with app.app_context():
            db.engine.connect()
            logger.info("✅ Successfully connected to database")
            
    except Exception as e:
        logger.error(f"❌ Failed to connect to database: {str(e)}")
        raise

def get_db():
    return db
