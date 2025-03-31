from app import db
from datetime import datetime

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    ride_id = db.Column(db.Integer, nullable=False, unique=True)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default="pending")  # pending, completed, failed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "ride_id": self.ride_id,
            "amount": self.amount,
            "status": self.status,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        }
