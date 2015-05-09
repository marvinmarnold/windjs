Chimes = new Mongo.Collection("chimesss");

if (Meteor.isClient) {
  Meteor.startup(function() {
    setInterval(function() {
      Meteor.call("bridgeGetMessages");
    }, 5000);
  });

  Template.body.events({
    "submit .new-message": function (e) {
      var username = e.target.username.value;
      var text = e.target.text.value;
      Meteor.call("bridgeSetName", username, text);
      e.target.text.value = "";

      return false;
    },
    "click .get-messages": function (e) {
      Meteor.call("bridgeGetMessages");
    }
  });

  Template.body.helpers({
    chimes: function () {
      return Chimes.find({}, {sort: {discoveredAt: -1}});
    }
  });
}

if (Meteor.isCordova) {
  Meteor.startup(function () {
    bluetoothSerial.enable();
  });
  Meteor.methods({
    bridgeSetName: function (username, text) {
      var createdAt = new Date().getTime();
      console.log("Changing the name");
      bluetoothSerial.setName("@" + username + ":" + createdAt + "##" + text);
      Meteor.call("createChime", "self", username, createdAt, createdAt, text);
    },
    bridgeGetMessages: function() {
      console.log("Getting messages");
      bluetoothSerial.discoverUnpaired(function(devices) {
        console.log("Returnning devices");
        devices.forEach(function(device) {
          console.log("New device");
          Meteor.call("addChime", device.id, device.name);
        });
      }, null);
    }
  });
}

Meteor.methods ({
  createChime: function(userID, username, discoveredAt, createdAt, text){
    Chimes.insert({
      text: text,
      createdAt: createdAt,
      discoveredAt: discoveredAt,
      username: username,
      userID: userID
    })
  },
  addChime: function(userID, bluetoothDeviceName) {
    if(bluetoothDeviceName && bluetoothDeviceName.search(/^@/) != -1) {
      var text = parseText(bluetoothDeviceName);
      var createdAt = parseCreatedAt(bluetoothDeviceName);
      var username = parseUsername(bluetoothDeviceName);

      var dups = Chimes.find({
        $and: [
          {text: text},
          {userID: userID},
          {createdAt: createdAt}
        ]
      });

      if(dups.count() === 0) {
        console.log("Adding chime");
        Chimes.insert({
          text: text,
          discoveredAt: new Date(),
          createdAt: createdAt,
          username: username,
          userID: userID
        });
      }
    }
  },

});

// @krainboltgreene:12345##message
var parseText = function(name) {
  return name.split("##")[1];
};

var parseCreatedAt = function(name) {
  return name.split("##")[0].split(":")[1];
};

var parseUsername = function(name) {
  return name.split(":")[0]
}