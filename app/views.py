

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
        filename=secure_filename(upload_photo.filename)
        upload_photo.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
        newuser=users(username,password,firstname,lastname,email,location,biography,filename)
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
        
        user=users.query.filter_by(username=username).first() 
        
        if user != None and check_password_hash(user.password, password):
            login_user(user)
            print(current_user.id)
            return jsonify({"message":"you are now logged in"})
        return jsonify({"message":"invalid password and/or username"})  
    
    errors=form_errors(form) 
    return jsonify({"errors":errors})

@app.route('/api/auth/logout')
@login_required 
def logout():
    logout_user()
    return jsonify({'message':"you are now logged out"}) 
    