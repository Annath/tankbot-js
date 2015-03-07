var zetta = require('zetta');
var MOTOR = require('./devices/motor/index');
var BATTERY = require('./devices/battery/index');

zetta()
  .name('Tankbot')
  .use(MOTOR, [ "P9_14", "P9_16" ], true)
  .use(MOTOR, [ "P8_13", "P8_19" ], true)
  .use(BATTERY, 'P9_40', { 'minVoltage': 9.0, 'maxVoltage': 12.6, 'divisor': 11, 'interval': 250 })
  .listen(1337, function(){
     console.log('Zetta is running at http://127.0.0.1:1337');
});
