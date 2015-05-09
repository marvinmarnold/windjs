if (Meteor.isClient) {
  Template.body.events({
    "submit .new-message": function (e) {
      var text = e.target.text.value;
      Meteor.call("setName", text);
      e.target.text.value = "";

      return false;
    },
    // "click .get-messages": function (e) {
      // var devices = Meteor.call("getMessages");
      // devices.forEach(function(device) {
      //   console.log(device.id);
      // });
    // }
  });
}

if (Meteor.isCordova) {
  Meteor.startup(function () {
    bluetoothSerial.enable();
  });
  Meteor.methods({
    setName: function (text) {
      bluetoothSerial.setName(text);
    },
    // getMessages: function() {
    //   return bluetoothSerial.discoverUnpaired(function(devices) {
    //     return devices;
    //   },null);
    // }
  });
}
