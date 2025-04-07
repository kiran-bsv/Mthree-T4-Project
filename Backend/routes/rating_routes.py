from flask import Blueprint, request, jsonify
from app import db
from models.rating_model import Rating, RatingDetail, RatingResponse, RatingCategory
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.captain_model import CaptainRatings, Captain

# Create a Blueprint for rating-related routes
ratings_bp = Blueprint('ratings', __name__)

# --------------------- Submit a Rating ---------------------
@ratings_bp.route('/rate', methods=['POST'])
@jwt_required()
def rate_captain():
    data = request.get_json()
    user_id = get_jwt_identity()
    captain_id = data.get('captain_id')
    ride_id = data.get('ride_id')
    overall_rating = data.get('rating')
    review = data.get('review', '')
    category_ratings = data.get('category_ratings', [])  # List of {category: name, score}

    # Validate rating range
    if not (1 <= overall_rating <= 5):
        return jsonify({"error": "Rating must be between 1 and 5"}), 400
    
    # Ensure captain exists
    captain = Captain.query.get(captain_id)
    if not captain:
        return jsonify({"error": "Captain not found"}), 400

    # Create main rating entry
    new_rating = Rating(user_id=user_id, captain_id=captain_id, ride_id=ride_id, rating=overall_rating, review=review)
    db.session.add(new_rating)
    db.session.flush()  # Retrieve rating ID before final commit

    # Create detailed category-wise ratings
    for category in category_ratings:
        category_name = category.get('category')
        score = category.get('score')

        if category_name and (1 <= score <= 5):
            # Create category if not exists
            category_obj = RatingCategory.query.filter_by(name=category_name).first()
            if not category_obj:
                category_obj = RatingCategory(name=category_name)
                db.session.add(category_obj)
                db.session.flush()  # Retrieve new category ID

            # Save the individual category rating
            db.session.add(RatingDetail(rating_id=new_rating.id, category_id=category_obj.id, category_name=category_obj.name ,score=score))

    # Recalculate and update captain’s average rating
    ratings = Rating.query.filter_by(captain_id=captain_id).all()
    avg_rating = round(sum(r.rating for r in ratings) / len(ratings), 2)

    captain_ratings_entry = CaptainRatings.query.filter_by(captain_id=captain_id).first()
    if captain_ratings_entry:
        captain_ratings_entry.average_rating = avg_rating
    else:
        # Create new entry if not found
        captain_ratings_entry = CaptainRatings(
            captain_id=captain.id,
            captain_name=f"{captain.firstname} {captain.lastname}",
            average_rating=avg_rating
        )
        db.session.add(captain_ratings_entry)

    db.session.commit()
    return jsonify({"message": "Rating submitted successfully"}), 201

# --------------------- Get All Rating Categories ---------------------
@ratings_bp.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    categories = RatingCategory.query.all()
    return jsonify({"categories": [{"id": cat.id, "name": cat.name} for cat in categories]})

# --------------------- Add New Rating Categories ---------------------
@ratings_bp.route('/categories/add', methods=['POST'])
@jwt_required()
def add_missing_categories():
    data = request.get_json()
    categories = data.get('categories', [])

    if not categories or not isinstance(categories, list):
        return jsonify({"error": "Invalid category list"}), 400

    added_categories = []
    for category_data in categories:
        category_name = category_data.get('name')
        # Add only if not already present
        if category_name and not RatingCategory.query.filter_by(name=category_name).first():
            new_category = RatingCategory(name=category_name)
            db.session.add(new_category)
            added_categories.append(category_name)

    db.session.commit()
    return jsonify({"message": "Categories added", "added_categories": added_categories}), 201

# --------------------- Captain Responds to a Rating ---------------------
@ratings_bp.route('/rate-response', methods=['POST'])
@jwt_required()
def respond_to_rating():
    data = request.get_json()
    captain_id = get_jwt_identity()
    rating_id = data.get('rating_id')
    response_text = data.get('response_text')

    if not response_text:
        return jsonify({"error": "Response text is required"}), 400

    # Prevent duplicate responses
    existing_response = RatingResponse.query.filter_by(rating_id=rating_id).first()
    if existing_response:
        return jsonify({"error": "Response already exists"}), 400

    # Save captain's response
    response = RatingResponse(rating_id=rating_id, captain_id=captain_id, response_text=response_text)
    db.session.add(response)
    db.session.commit()

    return jsonify({"message": "Response submitted successfully"}), 201
