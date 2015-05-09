Chimes = new Mongo.Collection("chimes");

if (Meteor.isClient) {
  Template.body.events({
    "submit .new-message": function (e) {
      var text = e.target.text.value;
      Meteor.call("bridgeSetName", text);
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
    bridgeSetName: function (text) {
      console.log("Changing the name");
      bluetoothSerial.setName("@" + (new Date().getTime())+"##"+text);
    },
    bridgeGetMessages: function() {
      console.log("Getting messages");
      bluetoothSerial.discoverUnpaired(function(devices) {
        console.log("Returnning devices");
        devices.forEach(function(device) {
          console.log("New device");
          Meteor.call("addChime", device.id, device.name);
        });
      },null);
    }
  });
}

Meteor.methods ({
  addChime: function(userID, bluetoothDeviceName) {
    if(bluetoothDeviceName && bluetoothDeviceName.search(/^@/) != -1) {
      console.log("Adding chime");
      Chimes.insert({
        text: parseText(bluetoothDeviceName),
        discoveredAt: new Date(),
        createdAt: parseCreatedAt(bluetoothDeviceName),
        userID: userID
      });
    }
  },

});

var parseText = function(name) {
  return name.split("##")[1];
}

var parseCreatedAt = function(name) {
  return name.split("##")[0];
}