from flask import Blueprint, request, jsonify
from app import db
from models.rating_model import Rating
from flask_jwt_extended import jwt_required, get_jwt_identity

ratings_bp = Blueprint('ratings', __name__)

@ratings_bp.route('/rate', methods=['POST'])
@jwt_required()
def rate_captain():
    data = request.get_json()
    user_id = get_jwt_identity()
    captain_id = data.get('captain_id')
    ride_id = data.get('ride_id')
    rating = data.get('rating')
    review = data.get('review', '')

    if not (1 <= rating <= 5):
        return jsonify({"error": "Rating must be between 1 and 5"}), 400

    new_rating = Rating(user_id=user_id, captain_id=captain_id, ride_id=ride_id, rating=rating, review=review)
    db.session.add(new_rating)
    db.session.commit()

    return jsonify({"message": "Rating submitted successfully"}), 201
