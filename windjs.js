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

  Meteor.methods({
    createMessage: function(device) {
      $('ul').append("<li>" + device.id + "</li>");
    }
  });
}

// if(Meteor.isServer) {
//   Meteor.methods({
//     setName: function(text) {
//       Meteor.call("bridgeSetName", text);
//     log: function(text) {
//       console.log(text);
//     }
//   });
// }

if (Meteor.isCordova) {
  Meteor.startup(function () {
    bluetoothSerial.enable();
  });
  Meteor.methods({
    bridgeSetName: function (text) {
      console.log("Changing the name");
      bluetoothSerial.setName(text);
    },
    bridgeGetMessages: function() {
      console.log("Getting messages");
      bluetoothSerial.discoverUnpaired(function(devices) {
        console.log("Returnning devices");
        devices.forEach(function(device) {
          console.log("New device");
          Meteor.call("createMessage", device);
        });
      },null);
    }
  });
}
