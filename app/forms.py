from flask import render_template, request, redirect, url_for, flash
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import StringField, SelectField, TextAreaField, PasswordField
from wtforms.validators import DataRequired, Email

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