var React = require('react');

var Search = require('./Search');
var MapA = require('./MapA');
var CurrentLocation = require('./CurrentLocation');
var LocationList = require('./LocationList');
var SearchUser = require('./SearchUser');
var helpers = require('../utils/helpers');
var Signup = require('./Signup');
var Login = require('./Login');

var MapApp = React.createClass({

  getInitialState(){

    // Extract the favorite locations from local storage

    var favorites = [];

    return {
      user: localStorage.getItem('username')||'',
      loggedin: localStorage.getItem('username') || false,
      signedupflag: false,
      favorites: favorites,
      currentAddress: 'Hack Reactor',
      mapCoordinates: {
        lat: 37.7836966,
        lng: -122.4089664
      },
      center: {
        lat: 37.7836966,
        lng: -122.4089664
      },
      filterCategory: 'default'
    };
  },

  loginUser(username, password){
    var self = this;
    console.log("login user works @@@@@@@@@@@@@@")
    helpers.checkUser(username, password, function(user) {
      console.log(user);
      if (user) {
        console.log("logged in:", username);
        self.setState({user: username, loggedin: true});
        localStorage.setItem('username', self.state.user);
        helpers.getAllBreadCrumbs(username, function(data){
          if(data){
            self.setState({favorites: data.pins});
            self.setState({signedupflag: false});
          }
        }.bind(this));
      }
    })
  },

  componentDidMount(){
  },

  addToFavBreadCrumbs(id, lat, lng, timestamp, details, location, category) {
    var favorites = this.state.favorites;
    var flag = false;
    var breadcrumb = {
      id: id,
      lat: lat,
      lng: lng,
      timestamp: timestamp,
      details: details,
      address: this.state.currentAddress,
      location: location,
      category: category
    };
    for(var i = 0; i<favorites.length;i++){
      if(favorites[i].id===breadcrumb.id){
        favorites[i] = breadcrumb;
        console.log('EDTTED BREADCRUMB',favorites[i])
        helpers.addBreadCrumb(this.state.user, breadcrumb, function(data){
          console.log('breadcrumb: ',breadcrumb)
          console.log(data);
        });
        flag = true;
      }

    }

    if(!flag){
       favorites.push(breadcrumb);
        helpers.addBreadCrumb(this.state.user, breadcrumb, function(data){
          console.log(data);
        });
    }

    console.log('FAVORITES BEFORE RERENDERING' ,favorites)
    this.setState({
      favorites: favorites
    });


    localStorage.favorites = JSON.stringify(favorites);

  },

  changeSignedUpFlag(flag){
    console.log('changeSignedUpFlag!!!!!!!!')
    this.setState({signedupflag:flag})
  },

  searchForAddress(address, cb, recenter){
    var self = this;
    console.log("search called", address);

    // We will use GMaps' geocode functionality,
    // which is built on top of the Google Maps API

    GMaps.geocode({
      address: address,
      callback: function(results, status) {

        if (status !== 'OK') return;

        var latlng = results[0].geometry.location;

        self.setState({
          currentAddress: results[0].formatted_address,
          mapCoordinates: {
            lat: latlng.lat(),
            lng: latlng.lng()
          }
        });

        if(recenter){
          self.setState({
            center: {
              lat: latlng.lat(),
              lng: latlng.lng()
            }
          });
        }

        if(cb){
          cb(results[0].formatted_address);
        }

      }
    });

  },

  filterResults(e){
    var faves;
    helpers.getAllBreadCrumbs(this.state.user, function(data){
      if(data){
        faves = data.pins;
        if (e.target.value !== 'default') {
          faves = faves.filter(function(d) {
            return d.category === e.target.value;
          })
        }
        console.log('FAVES: ', faves);
        this.setState({favorites: faves, filterCategory: e.target.value});
      }
    }.bind(this));
  },

  render(){
    if(this.state.loggedin && !this.state.signedupflag){
      return (

        <div>
          <h1 className="col-xs-12 col-md-6 col-md-offset-3">My Breadcrumbs</h1>
      


          <MapA lat={this.state.mapCoordinates.lat}
            lng={this.state.mapCoordinates.lng}
            favorites={this.state.favorites}
            onFavoriteToggle={this.toggleFavorite}
            onAddToFavBcs={this.addToFavBreadCrumbs}
            searchAddress={this.searchForAddress}
            address={this.state.currentAddress}
            center={this.state.center}
            loginUser={this.loginUser}
            user={this.state.user}
            filterCategory={this.state.filterCategory} />

          <LocationList locations={this.state.favorites}
            activeLocationAddress={this.state.currentAddress}
            onClick={this.searchForAddress} />

        </div>

      );
    } else if (!this.state.loggedin && !this.state.signedupflag) {
      console.log("go in to else if")
      return <Login loginUser={this.loginUser} changeFunction={this.changeSignedUpFlag}/>
    } else {
      console.log("go in to else")
      return <Signup loginUser={this.loginUser} changeFunction={this.changeSignedUpFlag}/>
    }
  }

});

module.exports = MapApp;
