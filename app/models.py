from app import db
from werkzeug.security import generate_password_hash



class Cars(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(255))
    make = db.Column(db.String(80))
    model = db.Column(db.String(80))
    colour = db.Column(db.String(80))
    year = db.Column(db.String(80))
    transmission = db.Column(db.String(80))
    car_type= db.Column(db.String(80))
    price=db.Column(db.Decimal)
    photo = db.Column(db.String(80))
    user_id = db.Column(db.Integer)

class Favourites(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    car_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80))
    password = db.Column(db.String(255))
    name = db.Column(db.String(80))
    email = db.Column(db.String(80))
    location = db.Column(db.String(80))
    biography = db.Column(db.String(80))
    photo = db.Column(db.String(80))
    date_joined = db.Column(db.DateTime)






