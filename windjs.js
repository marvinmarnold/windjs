if (Meteor.isClient) {
  Template.body.events({
      "submit .new-message": function (e) {
        var text = e.target.text.value;
        Meteor.call("setName", text);
        e.target.text.value = "";

        return false;
      }
  });
}

if (Meteor.isCordova) {
  Meteor.startup(function () {
    bluetoothSerial.enable();
  });
}

Meteor.methods({
  setName: function (text) {
    bluetoothSerial.setName(text);
  }
});