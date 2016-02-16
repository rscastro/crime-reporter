var React = require('react');
var helpers = require('../utils/helpers');

var Map = React.createClass({
  getInitialState(){
    return {
      location: '',
      breadcrumbs: [],
      lat: this.props.lat,
      lng: this.props.lng,
      previousMarker: null,
      currentMarker: null,
      lastMarkerTimeStamp: null,
      map: null
    }
  },
  
  handleLocationChange(e) {
    this.setState({location: e.target.value});  
  },
  
  handleCommentChange(e) {
    this.setState({comment: e.target.value});
  },

  matchBreadCrumb(timestamp){
    var breadcrumbs = this.props.favorites;
    for(var i = breadcrumbs.length - 1; i >= 0; i--){
      var breadcrumb = breadcrumbs[i];
      if(breadcrumb.timestamp === timestamp){
        this.setState({location: breadcrumb.location, comment: breadcrumb.details.note})
        return;
      }
    }

  },

  toggleFavorite(address){
    this.props.onFavoriteToggle(address);
  },

  addFavBreadCrumb(id, lat, lng, timestamp, details, infoWindow, location) {
    this.props.onAddToFavBcs(id, lat, lng, timestamp, details, infoWindow, location);
  },

  updateCurrentLocation(){
    if(this.state.previousMarker){
      this.state.previousMarker.setIcon({
        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        strokeColor: "red",
        scale: 5
      });
    }
    this.state.currentMarker.setIcon({
      path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      strokeColor: "green",
      scale: 5
    });
    this.state.previousMarker = this.state.currentMarker;
  },

  componentDidMount(){

    // Only componentDidMount is called when the component is first added to
    // the page. This is why we are calling the following method manually. 
    // This makes sure that our map initialization code is run the first time.

    // this.componentDidUpdate();
    var self = this;
    var map = new GMaps({
      el: '#map',
      lat: this.props.lat,
      lng: this.props.lng,
      styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}]

    });

    this.setState({map: map});

    //Right Click Menu
    map.setContextMenu({
      control: 'map',
      options: [{
        title: 'Add Bread Crumb',
        name: 'add_bread_crumb',
        action: function(e) {
          var addressString = e.latLng.lat().toString() + " " +  e.latLng.lng().toString();
          self.props.searchAddress(addressString, function(newLocation){
            self.setState({location: newLocation, comment: "Add comments here and save breadcrumb"});
          });
          var id = self.props.favorites.length;
          var time = Date.now();
          self.setState({lastMarkerTimeStamp: time});
          var marker = this.addMarker({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
            title: 'New marker',
            id: id,
            timestamp: time,
            icon: {
              path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              strokeColor: "green",
              scale: 5
            },
            click: function(e) {
              self.setState({currentMarker: this});
              self.updateCurrentLocation();
              self.matchBreadCrumb(e.timestamp);
              // this.setMap(null);
            }
          });
          self.setState({currentMarker: marker});
          self.updateCurrentLocation();
          // self.addFavBreadCrumb(id, e.latLng.lat(), e.latLng.lng(), Date.now(), {note: "I LOVE this place."}, {content: '<p>Dat info dohhh</p>'});
        }
      }, {
        title: 'Center here',
        name: 'center_here',
        action: function(e) {
          this.setCenter(e.latLng.lat(), e.latLng.lng());
        }
      }]
    });

    helpers.getAllBreadCrumbs(this.props.user, function(data){
      if(!data){
        return;
      }
      self.setState({breadcrumbs: data.pins});
      self.state.breadcrumbs.forEach(function(favorite, index){
        map.addMarker({
          lat: favorite.lat,
          lng: favorite.lng,
          title: 'New marker',
          id: index,
          timestamp: favorite.timestamp,
          icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            strokeColor: "red",
            scale: 5
          },
          click: function(e) {
            self.setState({currentMarker: this});
            self.updateCurrentLocation();
            self.matchBreadCrumb(e.timestamp);
            // self.state.currentMarker.setMap(null);
          }
        });

      });
    });

  },

  componentDidUpdate(){
    if(this.props.favorites.length !== this.state.breadcrumbs.length){
      this.setState({breadcrumbs: this.props.favorites});
      return;
    }
    if(this.lastLat == this.props.center.lat && this.lastLng == this.props.center.lng){

      // The map has already been initialized at this address.
      // Return from this method so that we don't reinitialize it
      // (and cause it to flicker).

      return;
    }

    this.state.map.setCenter(this.props.center.lat, this.props.center.lng);
    this.lastLat = this.props.center.lat;
    this.lastLng = this.props.center.lng

  },

  handleSubmit(e) {
    e.preventDefault();
    var id = this.props.favorites.length;
    var timestamp = this.state.lastMarkerTimeStamp;
    this.addFavBreadCrumb(id, this.props.lat, this.props.lng, timestamp, {note: this.state.comment}, this.state.location);
    this.setState({location: '', comment: ''});
  },

  render(){

    return (
      <div>
      <div className="map-holder">
        <p>Loading......</p>
        <div id="map"></div>
      </div>
      <form  onSubmit={this.handleSubmit} className="form-group list-group col-xs-12 col-md-6 col-md-offset-3" >
        <label htmlFor="location">Location:</label>
        <input type="text" className="form-control" id="location" onChange={this.handleLocationChange} value={this.state.location} placeholder="Location" />
        <label htmlFor="comment">Comment:</label>
        <textarea value={this.state.comment} onChange={this.handleCommentChange} className="form-control" rows="10" id="comment"></textarea>
        <div>
          <input type="submit" className="btn btn-primary" value="Save Breadcrumb" />
        </div>
      </form>
      </div>
    );
  }

});

module.exports = Map;
