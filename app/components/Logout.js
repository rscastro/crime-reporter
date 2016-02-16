var React = require('react');
var helpers = require('../utils/helpers');

var Logout = React.createClass({
  getInitialState: function() {
    return {
      username: localStorage.getItem('username')
    };
  },
  componentDidMount: function() {
    var response = localStorage.getItem('response');
    if (response) {
      FB.logout(function(response) {
      });
    }
    localStorage.clear();
  },
  render: function(){
    return (<div>
              <h1>Thank you for visiting {this.state.username}</h1>
              <a href="#map"> click to log in again </a>
            </div>
    )}
});

module.exports = Logout;
