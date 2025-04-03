from models.user_model import User, db, UserProfile, UserActivity
from werkzeug.security import generate_password_hash

def create_user(firstname, lastname, email, password):
    """Create a new user and save to the database."""
    if not all([firstname, email, password]):
        raise ValueError("All fields are required")
    
    fullname = f"{firstname} {lastname}".strip()  # Combine first & last name

    new_user = User(
        firstname=firstname,
        lastname=lastname or "",  # Default to empty string if lastname is not provided
        email=email,
        password_hash=generate_password_hash(password)  # Secure password hashing
    )

    db.session.add(new_user)
    db.session.flush()  # Get user ID before committing

    # Create UserProfile and UserActivity
    user_profile = UserProfile(user_id=new_user.id, fullname=fullname)
    user_activity = UserActivity(user_id=new_user.id)

    db.session.add_all([user_profile, user_activity])
    db.session.commit()

    return new_user
