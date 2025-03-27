from models.user_model import User, db
from werkzeug.security import generate_password_hash

def create_user(firstname, lastname, email, password):
    """Create a new user and save to the database."""
    if not all([firstname, email, password]):
        raise ValueError("All fields are required")

    new_user = User(
        firstname=firstname,
        lastname=lastname or "",  # Default to empty string if lastname is not provided
        email=email,
        password_hash=generate_password_hash(password)  # Secure password hashing
    )

    db.session.add(new_user)
    db.session.commit()

    return new_user
