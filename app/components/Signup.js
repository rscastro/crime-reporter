var React = require('react');
var helpers = require('../utils/helpers');

var Signup = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      password: '',
    };
  },
  handleUsernameChange: function(event) {
    this.setState({username: event.target.value});
  },
  handlePasswordChange: function(event){
    this.setState({password: event.target.value});
  },
  signup: function(e){
    e.preventDefault();
    var self = this;
    helpers.signupUser(this.state.username,this.state.password,function(data){
    self.props.loginUser(self.state.username, self.state.password);
    });
  },

  render: function(){
    return(
      <div>
         <h2>Sign up</h2>
         <form  onSubmit={this.signup} >
           <div>
             <label htmlFor="username">Username:</label>
             <input onChange={this.handleUsernameChange} value={this.state.username} id="username" type="text" name="username" />
           </div>
           <div>
             <label htmlFor="password">Password:</label>
             <input onChange={this.handlePasswordChange} value={this.state.password} id="password" type="password" name="password" />
           </div>
           <div>
             <input className="btn btn-primary" type="submit" value="Sign up" />
           </div>
       </form>
       <p>
         <a href="#login">Login to your account &rarr;</a>
       </p>
      </div>

    )
  }
});
// action="/api/users" method="post"
module.exports = Signup;
