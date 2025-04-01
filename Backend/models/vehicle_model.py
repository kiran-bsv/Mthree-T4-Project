from app import db

class Vehicle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    captain_id = db.Column(db.Integer, db.ForeignKey('captain.id'), nullable=False)
    vehicle_color = db.Column(db.String(50), nullable=False)
    vehicle_plate = db.Column(db.String(50), nullable=False)
    vehicle_capacity = db.Column(db.Integer, nullable=False)
    vehicle_type = db.Column(db.Enum('car', 'motorcycle', 'auto'), nullable=False)

    captain = db.relationship('Captain', backref=db.backref('vehicle', uselist=False))