from models.captain_model import Captain, db
from werkzeug.security import generate_password_hash

def create_captain(firstname, lastname, email, password, color, plate, capacity, vehicleType):
    if not all([firstname, email, password, color, plate, capacity, vehicleType]):
        raise ValueError("All fields are required")

    new_captain = Captain(
        firstname=firstname,
        lastname=lastname or "",
        email=email,
        password_hash=generate_password_hash(password),
        vehicle_color=color,
        vehicle_plate=plate,
        vehicle_capacity=capacity,
        vehicleType=vehicleType
    )

    db.session.add(new_captain)
    db.session.commit()
    
    return new_captain
