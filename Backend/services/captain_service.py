from models.captain_model import Captain, db, CaptainProfile, CaptainActivity
from werkzeug.security import generate_password_hash

def create_captain(firstname, lastname, email, password, color, plate, capacity, vehicleType):
    if not all([firstname, email, password, color, plate, capacity, vehicleType]):
        raise ValueError("All fields are required")
    
    fullname = f"{firstname} {lastname}".strip()  # Combine firstname and lastname

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
    db.session.flush()  # Ensure new_captain is available but not yet committed
    # db.session.refresh(new_captain)  # Ensure ID is assigned

    # Create related profile and activity
    captain_profile = CaptainProfile(captain_id=new_captain.id, fullname=fullname)
    captain_activity = CaptainActivity(captain_id=new_captain.id)

    db.session.add_all([captain_profile, captain_activity])
    db.session.commit()
    
    return new_captain
