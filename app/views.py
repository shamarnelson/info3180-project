from werkzeug.utils import secure_filename
import os
from app import app,db, login_manager
from flask import render_template,request,redirect,url_for,flash,jsonify,send_from_directory, session, abort, g, make_response
from app.forms import registerform,loginform, CarForm, SearchForm
from werkzeug.security import check_password_hash
from functools import wraps
from app.models import Users,Cars,Favourites

# Using JWT
import jwt
from flask import _request_ctx_stack
from functools import wraps
import datetime

def requires_auth(f):

    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get('Authorization', None) # or request.cookies.get('token', None)

        if not auth:
            return jsonify({'code': 'authorization_header_missing', 'description': 'Authorization header is expected'}), 401

        parts = auth.split()

        if parts[0].lower() != 'bearer':

            return jsonify({'code': 'invalid_header', 'description': 'Authorization header must start with Bearer'}), 401
        elif len(parts) == 1:
            return jsonify({'code': 'invalid_header', 'description': 'Token not found'}), 401
        elif len(parts) > 2:
            return jsonify({'code': 'invalid_header', 'description': 'Authorization header must be Bearer + \s + token'}), 401

        token = parts[1]
        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])

        except jwt.ExpiredSignatureError:
            return jsonify({'code': 'token_expired', 'description': 'token is expired'}), 401
        except jwt.DecodeError:
            return jsonify({'code': 'token_invalid_signature', 'description': 'Token signature is invalid'}), 401

        g.current_user = user = payload
        return f(*args, **kwargs)

    return decorated

###
# Routing for your application.
###
@app.route('/api/secure', methods=['GET'])
@requires_auth
def api_secure():
    # This data was retrieved from the payload of the JSON Web Token
    # take a look at the requires_auth decorator code to see how we decoded
    # the information from the JWT.
    user = g.current_user
    return jsonify(data={"user": user}, message="Success")


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """
    Because we use HTML5 history mode in vue-router we need to configure our
    web server to redirect all routes to index.html. Hence the additional route
    "/<path:path".
    Also we will render the initial webpage and then let VueJS take control.
    """
    return render_template('index.html')

@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)

@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response

def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages

@app.route('/api/users/register', methods=['POST'])
def register():
    form=registerform()
    if request.method =='POST' :
        username=request.form['username']
        password=(request.form['password'])
        """ generate hash ? """
        firstname=request.form['firstname']
        lastname=request.form['lastname']
        email=request.form['email']
        location=request.form['location']
        biography=request.form['biography']
        upload_photo=form.upload_photo.data 
        join_on=datetime.today()
        filename=secure_filename(upload_photo.filename)
        upload_photo.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
        newuser=Users(username,password,firstname,lastname,email,location,biography,filename,join_on)
        db.session.add(newuser)
        db.session.commit() 
        return jsonify({"message": "new user success fully made"})

    errors=form_errors(form) 
    return jsonify({"errors":errors})


@app.route('/api/auth/login',methods=['POST'])
def login():
    form=loginform 
    if request.method=='POST' :
        username=request.form['username']
        password=request.form['password']  
        
        user=Users.query.filter_by(username=username).first() 
        
        if user != None and check_password_hash(user.password, password):
            login_manager.login_user(user)
            print(login_manager.current_user.id)
            return jsonify({"message":"you are now logged in"})
        return jsonify({"message":"invalid password and/or username"})  
    
    errors=form_errors(form) 
    return jsonify({"errors":errors})

@app.route('/api/auth/logout')
@login_required 
def logout():
    login_manager.logout_user()
    return jsonify({'message':"you are now logged out"}) 

@app.route('/api/cars', methods=['POST','GET'])
def car():
    form=CarForm()
    
    if request.method == 'POST' and form.validate_on_submit():
            make=request.form['make']
            model=request.form['model']
            colour=request.form['colour']
            year=request.form['year']
            price=request.form['price']
            cartype=request.form['cartype']
            trans=request.form['transmission']
            desc=request.form['description']
            pic=request.files['pic'] 
            filename=secure_filename(pic.filename)
            car=Cars(make=make,model=model,colour=colour, year=year, transmission=trans,car_type=cartype,price=price,description=desc,photo=filename,user_id=g.current_user["userid"])
            if car is not None:
                db.session.add(car)
                db.session.commit()
                pic.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                jsonmsg=jsonify(message="Successful")         
                return jsonmsg
            else:
                err=form_errors(form)
                jsonErr=jsonify(errors=err)
                return jsonErr
            
    if request.method == 'GET':
        allc=[]
        cars=Cars.query.order_by(Cars.id).all()
        for c in cars:
            car={}
            car['id']=c.id
            car["user_id"]=c.user_id
            car["year"]=c.year        
            car["price"]=c.price
            car["photo"]=c.photo
            car["make"]=c.make
            car["model"]=c.model
            allc.append(car)
            return jsonify(allcars=allc,test=g.current_user["userid"])
        
@app.route('/api/cars/<car_id>', methods=['GET'])
def car_details(car_id):       
    if request.method == 'GET':
        c=Cars.query.filter_by(id=car_id).first()
        return jsonify(id=c.id,model=c.model,make=c.make,user_id=c.user_id,car_type=c.car_type,
            description=c.description,price=c.price,photo=c.photo,
            transmission=c.transmission,colour=c.colour,year=c.year)

@app.route('/api/cars/<car_id>/favourite', methods=['POST'])
def favourite_car(car_id):       
    if request.method == 'POST':
        userid=g.current_user['userid']
        fav=Favourites(car_id,userid)
        db.session.add(fav)
        db.session.commit()
        return jsonify(message="Car added as Favourite!")

@app.route('/api/users/<user_id>', methods=['GET'])
def user_details(user_id):       
    if request.method == 'GET':
        u=Users.query.filter_by(id=user_id).first()
        user={}
        user['id']=u.id
        user['username']=u.username
        user['name']=u.name
        user['email']=u.email
        user["location"]=u.location
        user["biography"]=u.biography        
        user["photo"]=u.photo
        user["date_joined"]=u.date_joined
        return jsonify(user=user)

@app.route('/api/users/<user_id>/favourites', methods=['GET'])
def user_favourites(user_id):       
    if request.method == 'GET':
        favcars=[]
        favouritecar=Favourites.query.filter_by(user_id=user_id).all()
        for x in favouritecar:
            c=Cars.query.filter_by(id=x.car_id).first()
            car={}
            car['id']=c.id
            car["user_id"]=c.user_id
            car["year"]=c.year        
            car["price"]=c.price
            car["photo"]=c.photo
            car["make"]=c.make
            car["model"]=c.model
            favcars.append(car)
        return jsonify(favcars=favcars)

@app.route('/api/search',methods=["GET"])
def car_search():
    search=[]
    if request.method=="GET":
        make=request.args.get('searchbymake')
        model=request.args.get('searchbymodel')
        search_cars= Cars.query.filter((Cars.make.like(make)|Cars.model.like(model)))
        for i in search_cars:
            car={}
            car['id']=i.id
            car["user_id"]=i.user_id
            car["year"]=i.year            
            car["price"]=i.price
            car["photo"]=i.photo
            car["make"]=i.make
            car["model"]=i.model
            search.append(car)
        return jsonify(searchedcars=search)
  
@login_manager.user_loader
def load_user(id):
    return Users.query.get(int(id))

@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
    