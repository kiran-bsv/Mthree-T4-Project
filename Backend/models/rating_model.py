from app import db
from datetime import datetime

class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    captain_id = db.Column(db.Integer, db.ForeignKey('captain.id'), nullable=False)
    ride_id = db.Column(db.Integer, db.ForeignKey('ride.id'), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    review = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
