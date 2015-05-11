WindJS
======
This project is inspired by [WindFarm](https://github.com/n8fr8/WindFarm).
It uses Meteor framework to change the broadcasted Bluetooth device name in order to communicate messages to those nearby.

Dependencies
-------
Meteor uses Cordova under the hood.
You will need to add the BluetoothSerial plugin for Cordova to Meteor.
This plugin has been updated to support the name changing functionality and currently is currently only supported on Android. You can add it to your project like this.

  meteor add cordova:com.megster.cordova.bluetoothserial@https://github.com/marvinmarnold/BluetoothSerial/tarball/99b312ed697fe83964776174716766cfbc34b0a3