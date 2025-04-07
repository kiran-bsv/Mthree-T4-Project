from app import db
from datetime import datetime

# main ride table 
class Ride(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    captain_id = db.Column(db.Integer, db.ForeignKey('captain.id'), nullable=True)
    pickup = db.Column(db.String(255), nullable=False)
    destination = db.Column(db.String(255), nullable=False)
    fare = db.Column(db.Float, nullable=False)

    status = db.Column(db.Enum('pending', 'accepted', 'ongoing', 'completed', 'cancelled'), default='pending')
    duration = db.Column(db.Float) 
    distance = db.Column(db.Float)  
    paymentID = db.Column(db.String(255), nullable=True)
    orderId = db.Column(db.String(255), nullable=True)
    signature = db.Column(db.String(255), nullable=True)
    otp = db.Column(db.String(6), nullable=False)
    vehicleType = db.Column(db.String(50), nullable=False)

# RideDiscount model to store ride discount information.This model is used to apply discounts to rides
class RideDiscount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ride_id = db.Column(db.Integer, db.ForeignKey('ride.id'), nullable=False, unique=True)
    discount_code = db.Column(db.String(50), nullable=False)
    discount_amount = db.Column(db.Float, nullable=False)
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)

    ride = db.relationship("Ride", backref=db.backref("discount", uselist=False))  # One-to-One Relationship

# RideInvoice model to store ride invoice information. This model is used to generate invoices for rides
class RideInvoice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ride_id = db.Column(db.Integer, db.ForeignKey('ride.id'), nullable=False, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    captain_id = db.Column(db.Integer, db.ForeignKey('captain.id'), nullable=False)
    base_fare = db.Column(db.Float, nullable=False)
    discount_amount = db.Column(db.Float, default=0.0)
    final_fare = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    ride = db.relationship("Ride", backref="invoice")