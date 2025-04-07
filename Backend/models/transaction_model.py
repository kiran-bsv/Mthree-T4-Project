from app import db
from datetime import datetime
import uuid

# Transaction model to store payment transactions
# This model is used to keep track of all transactions related to payments made by users.
class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    payment_id = db.Column(db.Integer, db.ForeignKey('payment.id'), nullable=False)
    transaction_id = db.Column(db.String(100), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    status = db.Column(db.String(20), nullable=False)  # pending, success, failed, refunded
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    amount = db.Column(db.Float, nullable=False)
    remarks = db.Column(db.String(255))

    payment = db.relationship('Payment', backref=db.backref('transactions', lazy=True))
