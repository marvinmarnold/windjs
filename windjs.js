if (Meteor.isClient) {
  Template.hello.events({
      "submit .new-message": function (e) {
        console.log(e);
        var text = e.target.text.value;

        Meteor.call("addTask", text);

        e.target.text.value = "";

        return false;
      }
  });
}


Meteor.startup(function () {
  if (Meteor.isCordova) {
    bluetoothSerial.enable();
    console.log("Bluetooth enabled");

  }
});

Meteor.methods({
  addTask: function (text) {
    console.log("Changing name to " + text);
    bluetoothSerial.setName(text);
  }
});