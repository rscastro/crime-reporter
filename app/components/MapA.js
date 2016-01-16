var React = require('react');
var helpers = require('../utils/helpers');
var markers = [];

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
      map: null,
      category: 'default',
      filterCategory: 'default',
      heatmap: null,
      markers: []
    }
  },

  handleLocationChange(e) {
    this.setState({location: e.target.value});
  },

  handleCommentChange(e) {
    this.setState({comment: e.target.value});
  },

  handleCategoryChange(e) {
    this.setState({category: e.target.value});
  },

  matchBreadCrumb(id){
    var breadcrumbs = this.props.favorites;
    for(var i = breadcrumbs.length - 1; i >= 0; i--){
      var breadcrumb = breadcrumbs[i];
      if(breadcrumb.id === id){
        this.setState({location: breadcrumb.location, comment: breadcrumb.details.note, category: breadcrumb.category})
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
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: {lat: this.props.lat, lng: this.props.lng},
      mapTypeId: google.maps.MapTypeId.SATELLITE
    });

    this.setState({map: map});

     var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);
       map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
   

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
    

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });


    //Right Click Menu
    google.maps.event.addListener(map, "rightclick", function(e) {
      $('.contextmenu').remove();

      var $contextMenu = $('<div class="contextmenu"></div>');
      $contextMenu.css({
        'position': 'absolute',
        'left': e.pixel.x,
        'top': e.pixel.y,
        'background-color': 'yellow',
        'border': '1px solid #cccccc',
        'padding': '2px 5px'
      });

      var $createbreadcrumb = $('<div class="createbreadcrumb">Create Breadcrumb</div>')
      var $centerhere = $('<div class="centerhere">Center Here</div>')
      var $closemenu = $('<div class="closemenu">Close Menu</div>')

      $createbreadcrumb.on('click', function() {
        $('.contextmenu').remove();

        var addressMarker = '';
        var noteMarker = '';

        var addressString = e.latLng.lat().toString() + " " +  e.latLng.lng().toString();
        self.props.searchAddress(addressString, function(newLocation){
          self.setState({location: newLocation, comment: "Add comments here and save breadcrumb"});
          addressMarker = newLocation;
          noteMarker = 'Add comments here and save breadcrumb';
        });
        var id = self.props.favorites.length;
        var time = Date.now();
        self.setState({lastMarkerTimeStamp: time});

        var marker = new google.maps.Marker({
          position: {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
          },
          map: map,
          title: 'title',
          id: id,
          timestamp: time,
          icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            strokeColor: 'green',
            scale: 5
          }
        });
        markers.push(marker);
        console.log('createbreadcrumb, markers ', markers)
        google.maps.event.addListener(marker, 'click', function(event) {

          self.setState({currentMarker: this});
          self.updateCurrentLocation();
            var testString = event.latLng.lat().toString() + " " +  event.latLng.lng().toString();
            self.props.searchAddress(testString, function(newLocation){

          });
          self.setState({location: addressMarker, comment: noteMarker});
          self.matchBreadCrumb(this.id);
        });
        self.setState({currentMarker: marker});
        self.updateCurrentLocation();
      });

      $centerhere.on('click', function() {
        $('.contextmenu').remove();
      });

      $closemenu.on('click', function() {
        $('.contextmenu').remove();
      });

      $createbreadcrumb.appendTo($contextMenu);
      $centerhere.appendTo($contextMenu);
      $closemenu.appendTo($contextMenu);

      $('#map').append($contextMenu);
    })

    helpers.getAllBreadCrumbs(this.props.user, function(data){
      if(!data){
        return;
      }
      self.setState({breadcrumbs: data.pins});
      self.state.breadcrumbs.forEach(function(favorite, index){
        var marker = new google.maps.Marker({
          position: {lat: favorite.lat, lng: favorite.lng},
          map: map,
          title: 'Marker',
          id: favorite.id,
          timestamp: favorite.timestamp,
          icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            strokeColor: 'red',
            scale: 5
          }
        });
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', function(event) {

          var testString = event.latLng.lat().toString() + " " +  event.latLng.lng().toString();
          self.props.searchAddress(testString, function(newLocation){

          });
          self.setState({currentMarker: this});
          self.updateCurrentLocation();
          self.matchBreadCrumb(this.id);

        });

      });
    });

  },

  componentDidUpdate(){
    // filtering map markers
    var self = this;
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(this.state.map);
    }

    for (var i = 0; i < markers.length; i++) {
      var temp = this.props.favorites.filter(function(favorite) {
        return favorite.id === markers[i].id;
      })
      if (temp.length === 0) {
        markers[i].setMap(null);
      }
    }

    if (self.state.heatmap) {
      var results = [];
      self.state.heatmap.set('map', null);
      self.state.heatmap = null;
      for (var i = 0; i < self.props.favorites.length; i++) {
        results.push(new google.maps.LatLng(self.props.favorites[i].lat, self.props.favorites[i].lng));
      }
      self.state.heatmap = new google.maps.visualization.HeatmapLayer({
        data: results,
        map: self.state.map,
        radius: 50
      });
      return results;
    }

  },

  toggleHeat() {
    var results = [];
    var self = this;
    console.log('getpoints')
    self.setState({'filterCategory': self.props.filterCategory});
    helpers.getAllBreadCrumbsForAll(function (data) {
      if (self.state.heatmap) {
        self.state.heatmap.set('map', null);
        self.state.heatmap = null;
      }
      else {
        for (var i = 0; i < data.pins.length; i++) {
          if (self.state.filterCategory === 'default') {
            results.push(new google.maps.LatLng(data.pins[i].lat, data.pins[i].lng));
          }
          else {
            if (self.state.filterCategory === data.pins[i].category) {
              results.push(new google.maps.LatLng(data.pins[i].lat, data.pins[i].lng));
            }
          }
        }
        self.state.heatmap = new google.maps.visualization.HeatmapLayer({
          data: results,
          map: self.state.map,
          radius: 50
        });

        return results;
      }
    })
  },

  changeColor() {
    var self = this;
    var gradient = [
      'rgba(0, 255, 255, 0)',
      'rgba(0, 255, 255, 1)',
      'rgba(0, 191, 255, 1)',
      'rgba(0, 127, 255, 1)',
      'rgba(0, 63, 255, 1)',
      'rgba(0, 0, 255, 1)',
      'rgba(0, 0, 223, 1)',
      'rgba(0, 0, 191, 1)',
      'rgba(0, 0, 159, 1)',
      'rgba(0, 0, 127, 1)',
      'rgba(63, 0, 91, 1)',
      'rgba(127, 0, 63, 1)',
      'rgba(191, 0, 31, 1)',
      'rgba(255, 0, 0, 1)'
    ];
    if (self.state.heatmap) {
      if (self.state.heatmap.get('gradient')) {
        self.state.heatmap.set('gradient', null)
      }
      else {
        self.state.heatmap.set('gradient', gradient)
      }
    }
  },

  handleSubmit(e) {
    var id = this.props.favorites.length;
    for(var i = 0;i<this.props.favorites.length; i++){
      if(this.props.favorites[i].id === this.state.currentMarker.id){
        id = this.state.currentMarker.id;
      }
    }
    e.preventDefault();
    var timestamp = this.state.lastMarkerTimeStamp;
    this.addFavBreadCrumb(id, this.props.lat, this.props.lng, timestamp, {note: this.state.comment}, this.state.location, this.state.category);
    this.setState({location: '', comment: ''});
  },

  render(){

    return (
      <div>
      <div>
        <input type="button" className="toggleHeatButton" value="Toggle Heat" onClick={this.toggleHeat}></input>
        <input type="button" className="colorChangeButton" value="Change Color" onClick={this.changeColor}></input>
      </div>
      <div className="map-holder">
        <p>Loading......</p>
        <input id="pac-input" class="controls" type="text" placeholder="Search Box"></input>
        <div id="map">
        </div>
      </div>
      <form onSubmit={this.handleSubmit} className="form-group list-group col-xs-12 col-md-6 col-md-offset-3" >
        <label htmlFor="location">Location:</label>
        <input type="text" className="form-control" id="location" value={this.state.location} onChange={this.handleLocationChange} placeholder="Location" />
        <label htmlFor="comment">Comment:</label>
        <textarea className="form-control" rows="10" id="comment" value={this.state.comment} onChange={this.handleCommentChange}></textarea>
        <label htmlFor="category">Category:</label>
        <select id="category" value={this.state.category} onChange={this.handleCategoryChange}>
          <option value="default">-- Choose a category --</option>
          <option value="Assault">Assault</option>
          <option value="Theft/Larceny">Theft/Larceny</option>
          <option value="Burglary">Burglary</option>
          <option value="Vandalism">Vandalism</option>
          <option value="Drugs/Alcohol Violations">Drugs/Alcohol Violations</option>
          <option value="Motor Vehicle Theft">Motor Vehicle Theft</option>
        </select>
        <div>
          <input type="submit" className="btn btn-primary" value="Report Crime" />
        </div>
      </form>
      </div>
    );
  }

});
module.exports = Map;
