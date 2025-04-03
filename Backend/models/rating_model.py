from app import db
from datetime import datetime

# Main Rating Table
class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    captain_id = db.Column(db.Integer, db.ForeignKey('captain.id'), nullable=False)
    ride_id = db.Column(db.Integer, db.ForeignKey('ride.id'), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    review = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship to RatingResponse
    responses = db.relationship('RatingResponse', backref='rating', lazy=True)

# Table for different rating categories (e.g., Safety, Cleanliness, Punctuality)
class RatingCategory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)  # Example: "Safety", "Punctuality"

# Table to store detailed rating breakdowns per category
class RatingDetail(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rating_id = db.Column(db.Integer, db.ForeignKey('rating.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('rating_category.id'), nullable=False)
    category_name = db.Column(db.String(100), nullable=False)  # Example: "Safety", "Punctuality"
    score = db.Column(db.Float, nullable=False)  # Example: 4.5 for "Safety"

    # Relationships
    rating = db.relationship('Rating', backref=db.backref('details', lazy=True))
    category = db.relationship('RatingCategory', backref=db.backref('details', lazy=True))

# Table for captains to respond to user ratings
class RatingResponse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rating_id = db.Column(db.Integer, db.ForeignKey('rating.id'), nullable=False)
    captain_id = db.Column(db.Integer, db.ForeignKey('captain.id'), nullable=False)
    response = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
