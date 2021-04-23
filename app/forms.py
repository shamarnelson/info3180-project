from flask import render_template, request, redirect, url_for, flash
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import StringField, SelectField, TextAreaField, PasswordField, DecimalField
from wtforms.validators import DataRequired, Email, InputRequired

class loginform(FlaskForm):
    username=StringField('username', validators=[DataRequired()])
    password=PasswordField('password', validators=[DataRequired()])

class registerform(FlaskForm):
    username=StringField('username', validators=[DataRequired()])
    password=StringField('password', validators=[DataRequired()])
    firstname=StringField('firstname', validators=[DataRequired()])
    lastname=StringField('lastname', validators=[DataRequired()])
    email=StringField('email', validators=[DataRequired(),Email()])
    location=StringField('location',validators=[DataRequired()]) 
    bio=TextAreaField('biography',validators=[DataRequired()]) 
    upload_photo=FileField('upload_photo',validators=[FileRequired(),FileAllowed(['jpg','png','Images only!'])])

class CarForm(FlaskForm):
    make = StringField('Make', validators=[InputRequired()])
    model = StringField('Model', validators=[InputRequired()])
    colour = StringField('Colour', validators=[InputRequired()])
    year = StringField('Year', validators=[InputRequired()])
    price = DecimalField('Price',places=2, validators=[InputRequired()])
    cartype=SelectField(u'Car Type' ,choices=[('SUV','SUV'),('Sports Car','Sports Car'),('Sedan','Sedan'),('Coupe','Coupe')])
    transmission=SelectField(u'Transmission' ,choices=[('Automatic','Automatic'),('Manual','Manual')])
    description= TextAreaField('Description', validators=[DataRequired()])
    pic=FileField('Upload Photo',validators=[FileRequired(),FileAllowed(['jpg','png'],'Images only!')])

class SearchForm(FlaskForm):
    searchbymake = StringField('Make', validators=[InputRequired()])
    searchbymodel = StringField('Model', validators=[InputRequired()])
