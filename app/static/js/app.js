
let displaySuccessMsg = False;
let displayDangerMsg = False;
var jwt;
let dangerMsg;
let successMsg;

const app = Vue.createApp({
  data() {
      return {

      }
  }
});


app.component('app-header', {
  name: 'AppHeader',
  template: `
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
    <a class="navbar-brand" href="/"><img id="icon" src="../static/imgs/photogram.png" alt="Logo"/> <b>Photogram</b></a>
    <button  type="button" data-toggle="collapse" class="navbar-toggler" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-label="Toggle navigation" aria-expanded="false">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <router-link class="nav-link" to="/addcar">Add Car<span class="sr-only">(current)</span></router-link>
        </li>
        <li class="nav-item active">
          <router-link class="nav-link" to="/myprofile">My Profile<span class="sr-only">(current)</span></router-link>
        </li>
        <li class="nav-item active">
          <router-link class="nav-link" to="/logout">Logout<span class="sr-only">(current)</span></router-link>
        </li>
      </ul>
    </div>
  </nav>
  `
});

app.component('app-footer', {
  name: 'AppFooter',
  template: `
  <footer>
      <br><br>
      <div class="container">
          <p>Copyright &copy; United Auto Sales.</p>
      </div>
  </footer>
  `
});

// forms
 
const registerForm = {
  name:'register-form', 
  template: `         
  <div class="container">
      <div id="centerDiv">
          <div class="register-form center-block">
              <div id = "message">
                  <p class="alert alert-success" v-if="success" id = "success"> {{ message }} </p>
                  <ul class="alert alert-danger" v-if="outcome === 'failure'" id = "errors">
                      <li v-for="error in errors" class="news__item"> {{ error }}</li>
                  </ul> 
              </div>
              <h1>Registration New User</h1>
              <form id="registerForm" @submit.prevent="registerUser" method="post" enctype="multipart/form-data">
                  <div class="form-group">
                      <label for="username"><b>Username</b></label> <input class="form-control" id="username" name="username" type="text" value="">
                  </div>
                  <div class="form-group">
                      <label for="password"><b>Password</b></label> <input class="form-control" id="password" name="password" type="password" value="">
                  </div>
                  <div class="form-group">
                      <label for="firstName"><b>Fullname</b></label> <input class="form-control" id="fullName" name="firstName" type="text" value="">
                  </div>
                  <div class="form-group">
                      <label for="email"><b>Email</b></label> <input class="form-control" id="email" name="email" type="text" value="">
                  </div>
                  <div class="form-group">
                      <label for="location"><b>Location</b></label> <input class="form-control" id="location" name="location" type="text" value="">
                  </div>
                  <div class="form-group">
                      <label for="biography"><b>Biography</b></label> <textarea class="form-control" id="biography" name="biography"></textarea>
                  </div>
                  <div class="form-group">
                      <label for="photo">Profile Photo</label>
                      <input class="form-control"  id="photo" name="photo" type="file">
                  </div>
                
                  <button type="submit" name="submit" class="btn btn-primary btn-block"><b>Register</b></button>
              </form>
        </div>
      </div>
  </div>
  `,
  data(){
      return {
        outcome: '',
        errors: [],
        message: '',
        success: false
      }
  },
  methods: {
    registerUser() {
      let router = this.$router;
      let registerForm = document.getElementById('registerForm');
      let form_data = new FormData(registerForm);
      let self = this;
      fetch("/api/users/register", {
        method: 'POST',
        body: form_data,
        headers: {
          'X-CSRFToken': token
        },
        credentials: 'same-origin'
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (jsonResponse) {
          // display a success message
          console.log(jsonResponse);
          if(jsonResponse.hasOwnProperty('registerError')) {
            self.errors = jsonResponse.registerError.errors;
            self.outcome = 'failure';
          } else {
            successMsg = jsonResponse.successMsg.message;
            displaySuccessMsg = true;
            router.push('login')
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
};


const loginForm = {
  name:'login-form', 
  template: `
  <div class="container">
          
      <div id="centerDiv">
          <div class="login-form center-block">
              <div id = "message">
                  <p class="alert alert-success" v-if="success" id = "success"> {{ message }} </p>
                  <p class="alert alert-danger" v-if="outcome === 'singleError'" id = "error"> {{ errorMessage }} </p>
                  <ul class="alert alert-danger" v-if="outcome === 'multipleErrors'" id = "errors">
                      <li v-for="error in errors" class="news__item"> {{ error }}</li>
                  </ul> 
              </div>
              <h1>Login in to your account</h1>
              
              <form id="loginForm"  @submit.prevent="loginUser" method="post">
                  <div class="form-group">
                      <label for="username"><b>Username</b></label>
                      <input class="form-control" id="username" name="username" placeholder="Enter your username" type="text" value="">
                  </div>
                  <div class="form-group">
                      <label for="password"><b>Password</b></label>
                      <input class="form-control" id="password" name="password" type="password" placeholder="Enter your password" value="">
                  </div>
                  <button type="submit" name="submit" class="btn btn-primary btn-block"><b>Login</b></button>
              </form>
          </div>
      </div>

  </div>
  `,
  data(){
      return {
        outcome: '',
        errors: [],
        errorMessage: '',
        message: '',
        success: false
      }
  },
  mounted(){

    let self = this;
    if(displaySuccessMsg) {
      displaySuccessMsg = false;
      self.success = true;
      self.message = successMsg;
    }
        
  },
  methods: {
    loginUser() {
      let router = this.$router;
      let loginForm = document.getElementById('loginForm');
      let form_data = new FormData(loginForm);
      let self = this;
      fetch("/api/auth/login", {
        method: 'POST',
        body: form_data,
        headers: {
          'X-CSRFToken': token
        },
        credentials: 'same-origin'
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (jsonResponse) {
          // display a success message
          console.log(jsonResponse);

          if(jsonResponse.hasOwnProperty('loginError')) {

            self.errorMessage = jsonResponse.loginError.error;
            self.outcome = 'singleError';
            self.success = false;

          } else if(jsonResponse.hasOwnProperty('loginErrors')) {

            self.errors = jsonResponse.loginErrors.errors;
            self.outcome = 'multipleErrors'
            self.success = false;

          } else {

            successMsg = jsonResponse.successMsg.message;
            current_userid = jsonResponse.successMsg.user_id;
            displaySuccessMsg = true;
            jwt = jsonResponse.successMsg.token;
            router.push('explore')

          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
};


const explorepage = {
  name: 'explorepage',
  template: `
      <div class="container maincontainer" >
          <div id="displayexplore">
              <h2>Explore</h2>
              <div id="explore-search">
                  <form @submit.prevent="search()" id="explore-form" method="GET" >
                      <div class="form-group col-4">
                          <label for="make">Make</label>
                          <input type="text" class="form-control" name="make" />
                      </div>
                      <div class="form-group col-4">
                          <label for="model">Model</label>
                          <input name="model" type="text" class="form-control" />
                      </div>
                      <div class="form-group search-btn-div">
                          <button type="submit" class="btn btn-success  search-btn">Search</button>
                          </div>
                  </form>
              </div>  
              <div class="carslist" v-if="listOfCars[0]">
              <div v-for="cars in listOfCars">
                  <div class="card" style="width: 15rem;">
                      <img class="card-img-top "  :src="cars.photo">
                    <div class="card-body">
                        <div class="name-model-price">
                       <div class="name-model">
                            <span  class="car-name">{{cars.year.concat(" ",cars.make)}}</span>
                         <span class="graytext">{{cars.model}}</span>
                         </div>
                         <a href="#" class="btn btn-success  card-price-btn">
                         <img class="icons" src='/static/images/tagicon.png'>
                         <span><span>$</span>{{cars.price}}</span>
                       </a>
                      </div>
                      <a :href="cars.id" @click="getCarDetails" class="btn btn-primary card-view-btn">View more details</a>
                </div>
                </div>
              </div>
              </div>
          </div>
      </div>
  `,
  created() {
      let self = this;
      fetch("/api/cars", {
          method: 'GET',
          headers: {
              'X-CSRFToken': token,
              'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          credentials: 'same-origin'        
      })
      .then(function(response) {
          return response.json();
      })
      .then(function(jsonResponse) {
          let count=0
          let temp=[]
          let carz=jsonResponse.data.reverse()
          for (let index = 0; index < carz.length; index++) {
              if (index==3){
                  break;
              }
              temp.push(jsonResponse.data[index]); 
          }
          self.listOfCars=temp;
      })
      .catch(function(error) {
          console.log(error);
      });
  },
  data() {
      return {
          listOfCars : []
      }
  },
  methods: {
      getCarDetails: function(event) {
          event.preventDefault();
          let carid=event.target.getAttribute("href");
          router.push({ name: 'details', params: { id: carid}}); 
      },

      search: function() {
          let self = this;
          let exploreForm = document.getElementById('explore-form');
          let form_data = new FormData(exploreForm);
          
          let form_values = []

          for (var p of form_data) {
              form_values.push(p[1].trim());
          }

          let make = form_values[0];
          let model = form_values[1];

          fetch("/api/search?make=" + make + "&model=" + model, {
              method: 'GET',
              headers: {
                  'X-CSRFToken': token,
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
              },
              credentials: 'same-origin'        
          })
          .then(function(response) {
              return response.json();
          })
          .then(function(jsonResponse) {
              self.listOfCars = jsonResponse.data.reverse();
          })
          .catch(function(error) {
              console.log(error);
          });
      }
  }
};

const User_Page = {
  name: 'User_Page',
  template: `
      <div class="container maincontainer">
          <div id="displayfav">
              <div id="profile">
                  <div id="profileimagediv">
                      <img class="favcar" id="round" :src="user.photo">
                  </div>
                  <div id="profiledetailsdiv" class="descriptions">
                      <h2 id="profile-name">{{user.name}}</h2>
                      <h4 class="graytext">@<span>{{user.username}}</span></h4>
                      <p class="graytext">{{user.biography}}</p>
                      <div >
                          <div>
                              <p class="profile-user-info graytext">Email</p>
                              <p class="profile-user-info graytext">Location</p>
                              <p class="profile-user-info graytext">Joined</p>
                          </div>
                          <div>
                              <p class="profile-user-info">{{user.email}}</p>
                              <p class="profile-user-info">{{user.location}}</p>
                              <p class="profile-user-info">{{user.date_joined}}</p>
                          </div>
                      </div> 
                  </div>
              </div>
              <div ><h1>Cars Favourited</h1></div>
              <div class="carslist">
              <div v-for="cars in listOfCars">
                  <div class="card" style="width: 18rem;">
                      <img class="card-img-top favcar"  :src="cars.photo">
                      <div class="card-body">
                          <div class="name-model-price">
                              <div class="name-model">
                                  <span  class="car-name">{{cars.year.concat(" ",cars.make)}}</span>
                                  <span class="graytext">{{cars.model}}</span>
                              </div>
                              <a href="#" class="btn btn-success card-price-btn">
                                  <img class="icons" src='/static/images/'>
                                  <span><span>$</span>{{cars.price}}</span>
                              </a>
                          </div>
                          <a :href="cars.id" class="btn btn-primary card-view-btn" @click="getCarFavDetails">View more details</a>
                      </div>
                  </div>
              </div>
              </div>
          </div>
      </div>  
  `, 
  created: function() {
      let self=this;
          fetch("/api/users/"+ localStorage.getItem('current_user'), {
              method: 'GET',
              headers: {
                  'X-CSRFToken': token,
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
              },
              credentials: 'same-origin'        
          })
          .then(function(response) {
              return response.json();
          })
          .then(function(jsonResponse) {
              self.userInfo = jsonResponse.data;
              fetch("/api/users/"+ localStorage.getItem('current_user') + "/favourites", {
                  method: 'GET',
                  headers: {
                      'X-CSRFToken': token,
                      'Authorization': 'Bearer ' + localStorage.getItem('token')
                  },
                  credentials: 'same-origin'        
              })
              .then(function(response) {
                  return response.json();
              })
              .then(function(jsonResponse) {
                  self.listOfCars = jsonResponse.data;
              })
              .catch(function(error) {
                  console.log(error);
              });
          })
          .catch(function(error) {
              console.log(error);
          });      
  },
  methods:{
      getCarFavDetails: function(event) {
          event.preventDefault();
          let carid=event.target.getAttribute("href");
          router.push({ name: 'details', params: { id: carid}}); 
      }
  },
  data() {
      return {
          listOfCars: [],
          userInfo: [],
          host:window.location.protocol + "//" + window.location.host
      }
  }
};

const Details = {
  name: 'Details',
  template: `
      <div class="container maincontainer">
          <div id="display-car-details" v-if="details[0]">
              <div id="car-details-card">
                  <img id="car-d-image" class="car-detail-image" :src="details[0].photo" alt="car image in card">
                  <div id="car-details">
                      <h1 id="car-d-heading" > {{details[0].year.concat(" ",details[0].make)}}</h1>
                      <h4 class="graytext">{{details[0].model}}</h4>
                      <p class="car-d-description graytext">{{details[0].description}}</p>
                      <div id="reduce-gap">
                          <div class="cpbd">
                              <div class="cp">
                                  <div>
                                      <p class="car-d-spec graytext">Color</p>
                                  </div>
                                  <div>
                                      <p class="car-d-spec">{{details[0].colour}}</p>
                                  </div>
                              </div>
                              <div class="bd">
                                  <div>
                                      <p class="car-d-spec graytext">Body Type</p>
                                  </div>
                                  <div>
                                      <p class="car-d-spec">{{details[0].type}}</p>
                                  </div>
                              </div>
                              <br>
                          </div>
                          <div class="cpbd">
                              <div class="cp">
                                  <div>
                                      <p class="car-d-spec graytext">Price</p>
                                  </div>
                                  <div>
                                      <p class="car-d-spec">{{details[0].price}}</p>
                                  </div>
                              </div>
                              <div class="bd">
                                  <div>
                                      <p class="car-d-spec graytext">Transmission</p>
                                  </div>
                                  <div>
                                      <p class="car-d-spec">{{details[0].transmission}}</p>
                                  </div>
                              </div>
                              <br>
                          </div>
                      </div>
                      <div id="card-d-btns" >
                          <a href="#" class="btn btn-success ">Email Owner</a>
                          <div " >
                              <button href="#" v-if="fav()" @click="addFavourite" id="heartbtn" class="heart fa fa-heart"></button>
                              <button href="#" v-else @click="addFavourite" id="heartbtn" class="heart fa fa-heart-o fa-heart"></button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div> 
  `,
  created(){
      let self=this;
      fetch("/api/cars/"+this.$route.params.id, {
          method: 'GET',
          headers: {
              'X-CSRFToken': token,
              'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          credentials: 'same-origin'        
      })
      .then(function(response) {
          return response.json();
      })
      .then(function(jsonResponse){
          self.details = jsonResponse.data;
          this.isFav=jsonResponse.isFav;
      })
      .catch(function(error) {
          console.log(error);
      });
  }, 
  methods: {
      addFavourite: function(event) {
          event.target.classList.toggle("fa-heart-o");
          if(event.target.classList.contains("fa-heart-o")===false){
              fetch("/api/cars/"+this.$route.params.id+"/favourite", {
                  method: 'POST',
                  body: JSON.stringify({"car_id": this.$route.params.id,"user_id": localStorage.getItem("current_user")}),
                  headers: {
                      'Content-Type': 'application/json',
                      'X-CSRFToken': token,
                      'Authorization': 'Bearer ' + localStorage.getItem('token')
                  },
                  credentials: 'same-origin' 
              })
              .then(function(response) {
                  return response.json();
              })
              .then(function(jsonResponse) {
                  if (jsonResponse.message!=undefined) {
                      
                  }
              })
              .catch(function(error) {
                  console.log(error);
              });
          }
          else{
              fetch("/api/cars/"+this.$route.params.id+"/favourite/remove", {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'X-CSRFToken': token,
                      'Authorization': 'Bearer ' + localStorage.getItem('token')
                  },
                  credentials: 'same-origin' 
              })
              .then(function(response) {
                  return response.json();
              })
              .then(function(jsonResponse) {
                  console.log(jsonResponse.data)
              })
              .catch(function(error) {
                  console.log(error);
              });
          }
      },
      fav(){
          if (self.isFav) {
              return true;
          }
          return false;
      
      }
  },
  data(){
      return {
          details: [],
          isFav: false
      }
  }
};

const Home = {
  name: 'Home',
  template: `
  <div>
      <div id = "message">
        <p class="alert alert-danger" v-if="danger" id = "success"> {{ message }} </p>
      </div>
      <div class="row">
      <div class="col">
          <h1 style="padding-top: 150px;"> Buy and Sell <br/>Cars Online</h1>
          <p class="lead">United Auto Sales provides the fastest, easiest and<br/>
          most user friendly way to buy or sell cars online. Find a<br/>
          Great Price on the Vehicle You Want.</p>
          <div class="row" style="padding-right: 450px;">
              <div class="col-sm-12 text-center">
              <button @click="$router.push('login')" id="btnLogin" class="btn btn-primary"  type="submit" name="submit"><b>LOGIN</b></button>
                  <button @click="$router.push('register')" id="btnRegister" class="btn btn-success"  type="submit" name="submit"><b>REGISTER</b></button>
                  </div>
              </div>
          </div>
      </div>
              </div>
          </div>
      </div>
      <img style= "padding-bottom: 20px;" id= "redCar"  src="{{ url_for('static', filename='imgs/red_audi-unsplash.jpg') }}" alt="Red Car"/>
  </div>
  `,
  data() {
      return {}
  }
};

const AddCarForm = {
  name: 'AddCarForm',
  template: `
  <div class="container maincontainer">
  <div class="m-4 ">
      <h2 id="newcar" class="mb-4" >Add New Car</h2>
      <form  @submit.prevent="addCar()" class="form" method="POST" action="" id="car-form" >
          <div class="mt-sm-1 mb-sm-1 d-flex flex-area1">
              <div>
                  <label class="" for="make">Make</label><br>
                  <input type="text" class="form-control form-field" name="make" required>
              </div>
              <div>
                  <label class="" for="model">Model</label><br>
                  <input type="text" class="form-control form-field" name="model" required>
              </div>
          </div>
          <div class="mt-sm-3 mb-sm-1 d-flex flex-area1">
              <div>
                  <label class="" for="colour">Colour</label><br>
                  <input type="text" class="form-control form-field" name="colour" required>
              </div>
              <div>
                  <label class="" for="year">Year</label><br>
                  <input type="text" class="form-control form-field" name="year" required>
              </div>
          </div>
          <div class="mt-sm-3 mb-sm-1 d-flex flex-area1">
              <div>
                  <label class="" for="price">Price</label><br>
                  <input type="number" class="form-control form-field" name="price" required>
              </div>
              <div>
                  <label class="" for="ctype">Car Type</label><br>
                  <select name="ctype" class="form-control form-field" required>
                      <option value="SUV">SUV</option>
                      <option value="Sedan">Sedan</option>
                      <option value="Truck">Truck</option>
                      <option value="Hybrid/Electric">Hybrid/Electric</option>
                      <option value="Coupe">Coupe</option>
                      <option value="Sports Car">Sports Car</option>
                      <option value="Diesel">Diesel</option>                    
                      <option value="Super Car">Super Car</option>
                      <option value="Van">Van</option>
                  </select>
              </div>
          </div>
          <div >
              <label class="" for="transmission">Transmission</label><br>
              <select name="transmission" class="form-control form-field" required>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
              </select>
          </div>
          <div>
              <label class="" for="description">Description</label><br>
              <textarea name="description" class="form-control" rows="4" required></textarea><br>
          </div>
          <div class="">
              <label class="" for="photo">Submit Photo</label><br>
              <input type="file" class="form-control form-field" name="photo" accept=".jpeg, .jpg, .png" required>
          </div>
          <button type="submit" name="submit" class="btn color text-white mt-sm-3 mb-sm-1">Save</button>
      </form>
  </div>
  </div>
  `,
  data() {
      return {}
  }, 
  methods: {
      addCar: function() {

          let self = this;
          let CarForm = document.getElementById('car-form');
          let form_data = new FormData(CarForm);

          fetch("/api/cars", {
              method: 'POST',
              body: form_data,
              headers: {
                  'X-CSRFToken': token,
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
              },
              credentials: 'same-origin'        
          })
          .then(function(response) {
              console.log(response);
              return response.json();
          })
          .then(function(jsonResponse) {
              if(jsonResponse.data){
                  router.push('/explore');
                  swal({title: "Add Car",text: jsonResponse.message,icon: "success",button: "Proceed"});
              }else{
                  swal({title: "Add Car",text: jsonResponse.errors[0],icon: "error",button: "Try Again"});
              }
              
          })
          .catch(function(error) {
              console.log(error);
          });
  
      }
      
  }
};



const NotFound = {
  name: 'NotFound',
  template: `
  <div>
      <h1>404 - Not Found</h1>
  </div>
  `,
  data() {
      return {}
  }
};

// Define Routes
const routes = [
  { path: "/", component: Home },

  {path: "/register", component: registerForm},

  {path: "/login", component: loginForm},
  
  { path: "/users/:id",name:"users", component: User_Page },

  {path: "/cars/:id",name:"details", component: Details},

  {path: "/addcar", component: AddCarForm},

  {path: "/explore", component: explorepage},

  // This is a catch all route in case none of the above matches
  {path: "/logout", component: logout},
  
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes, // short for `routes: routes`
});

app.use(router);

app.mount('#app');
  