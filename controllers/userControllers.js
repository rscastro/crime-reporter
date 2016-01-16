//****************************************************
//These controller functions are called by the router,
//and manipulate the database.
//****************************************************
var mongoose = require('mongoose');
var User = require('../models/user.js');
var Pin = require('../models/pin.js');

//////////////////
//users controllers
//////////////////

//Adds a new user; called when api/users hears a post request.
exports.addUser = function(name, callback) {
  User.findOne({username: name.username, password: name.password }, function(err, user){
    if(user){
      callback(null, user);
    }
    else{
      User.create(name, function (err, person) {
          if (err) {
            callback(err);
            return;
          }
          callback(null, person);
      });
    }
  });
}

//Removes a user; called when api/users hears a delete request.
exports.removeUser = function(name, callback) {
  User.remove(name, function (err, person) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, person);
  });
}

//check a user to see when it logged in or not
exports.checkUser = function(name, callback) {
  User.findOne({username: name.username, password: name.password }, function(err, user){
    console.log('GOING INSIDE CHECKUSER', user);
    if(user){
      callback(null, user);
    }
    else{
      callback(null, null);
    }
  });
}

//////////////////
//pins controllers
//////////////////

//find all pins
exports.getAllPins = function (callback) {
  Pin.find({}, function (err, pins) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, {pins: pins});
  });
};

//find pins of single user
exports.findOne = function (query, callback) {
  // User.findOne(query, function (err, person) {
  //   if (err) {
  //     callback(err);
  //     return;
  //   }
  //   callback(null, person);
  // });
  Pin.find(query, function (err, pins) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, {pins: pins});
  });
};

//find user and add new pin to pins collection, one at a time
//called when api/maps/:username hears a put request
exports.updatePins = function (query, newPin, callback) {

  if(!newPin){
    return;
  } else {
    console.log('NEWPINID LOOK HERE TO SEE IF EXISTS: ', newPin)
    var tempInt = parseInt(newPin.id)
    console.log('WHY YOU NO TURN INTO INT', tempInt)
    Pin.findOne({id: tempInt}, function(err, pin){
      console.log('GOING INSIDE FINDONE PIN ', pin)
      if(pin){
        delete newPin.id;
        Pin.update({id: tempInt}, newPin, function(err, numAffected, rawResponse){
          console.log(rawResponse, 'UPDATE STUFFZ', numAffected);
          callback(null, rawResponse)
        } )
      }
      else{
        var pinToCreate = new Pin(newPin);
        pinToCreate.save(function (err, pin) {
          if (err) {
            callback(err);
            return;
          }
          console.log('NEW PIN SUCCESSFULLY CREATED')
          callback(null, pinToCreate);
        })

      }
    })
  }

};


//remove last pin: only used in testing
exports.removeLastPin = function (name, callback) {
  User.findOne(query, function (err, doc) {
    console.log('remove from database')
    if (err) {
      callback(err);
      return;
    }

    console.log('doc:', doc)
    if(doc){
      var poppedPin = doc.pins.pop();

      doc.save();
    }
    callback(null, poppedPin);

  });
};



//deletes a specific pin. called when api/maps/:username hears a delete request
exports.deletePin = function (name, pinId, callback) {
  User.findOne(name, function (err, user) {
    console.log('trying to delete pin');
    for (var i = 0; i < user.pins.length; i++) {
      var pin = user.pins[i];
      if (pin._id == pinId) {
        user.pins = user.pins.slice(0, i ).concat(user.pins.slice(i+1));
        user.save();
        callback(err, pin);
      }
    }

  });
};

//get all people --for testing mostly
exports.getAll = function (callback) {
  User.find({}, function (err, persons) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, persons);
  });
};

//example pins
// [{"lat":37.78696217255432,"lng":-122.40696430206299,"timestamp":1452391665585,"details":{"note":"I LOVE this place."},"infoWindow":{"content":"<p>Dat info dohhh</p>"}},8

// {"lat":37.7865043039168,"lng":-122.40644931793213,"timestamp":1452391678701,"details":{"note":"I meh this place."},"infoWindow":{"content":"<p>llllalala</p>"}},


// {"lat":37.78613123179135,"lng":-122.40491509437561,"timestamp":1452394116848,"details":{"note":"I hate this place."},"infoWindow":{"content":"<p>skip skip</p>"}}]
