var React = require('react');
var helpers = require('../utils/helpers');

var Login = React.createClass({
  getInitialState: function() {
    localStorage.clear();
    return {
      username: '',
      password: '',
    };
  },

  componentDidMount: function() {
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '149080942133417',
        cookie     : true,  // enable cookies to allow the server to access
                          // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.5' // use version 2.5
      });

      // Now that we've initialized the JavaScript SDK, we call
      // FB.getLoginStatus().  This function gets the state of the
      // person visiting this page and can return one of three states to
      // the callback you provide.  They can be:
      //
      // 1. Logged into your app ('connected')
      // 2. Logged into Facebook, but not your app ('not_authorized')
      // 3. Not logged into Facebook and can't tell if they are logged into
      //    your app or not.
      //
      // These three cases are handled in the callback function.
      FB.getLoginStatus(function(response) {
        this.statusChangeCallback(response);
      }.bind(this));
    }.bind(this);

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  },

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  FBAPI: function() {
    var self = this;
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login username: ', response.name);
      console.log('Successful login usernid: ', response.id);
      if (response.name && response.id) {
        helpers.signupUser(response.name, response.id, function(data){
        self.props.loginUser(response.name, response.id);
        });
      }
    });
  },

  // This is called with the results from from FB.getLoginStatus().
  statusChangeCallback: function(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      localStorage.setItem('response',response);
      this.FBAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
     // document.getElementById('status').innerHTML = 'Please log ' +
      'into Facebook.';
    }
  },

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  checkLoginState: function() {
      var self = this;
    FB.getLoginStatus(function(response) {
      self.statusChangeCallback(response);
    });
  },

  handleClick: function() {
    FB.login(this.checkLoginState);
  },

  handleUsernameChange: function(event) {
    this.setState({username: event.target.value});
  },
  handlePasswordChange: function(event){
    this.setState({password: event.target.value});
  },
  login: function(e){
    e.preventDefault();
    var self = this;
    localStorage.setItem('username', this.state.username);
    console.log("Login called:", this.state.username, this.state.password);
    helpers.login(this.state.username,this.state.password);
    this.props.loginUser(this.state.username, this.state.password);
  },
  change: function(){
    this.props.changeFunction(true);
  },

  render: function(){
    return(
      <div>
         <h2>Login</h2>
         <form  onSubmit={this.login} >
           <div>
             <label htmlFor="username">Username:</label>
             <input onChange={this.handleUsernameChange} value={this.state.username} id="username" type="text" name="username" />
           </div>
           <div>
             <label htmlFor="password">Password:</label>
             <input onChange={this.handlePasswordChange} value={this.state.password} id="password" type="password" name="password" />
           </div>
           <div>
             <input className="btn btn-primary" type="submit" value="Log In" />
           </div>
       </form>
       <p>
         <a onClick={this.change}>Sign up for an account &rarr;</a>
       </p>
         <img src={'http://i.stack.imgur.com/ZW4QC.png'} alt="facebook login" className="img-responsive" onClick={this.handleClick}/>
      </div>

    )
  }
});

module.exports = Login;
