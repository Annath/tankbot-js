var zetta = require('zetta');
var MOTOR = require('./devices/motor/index');
var BATTERY = require('./devices/battery/index');

zetta()
  .name('FirstName-LastName')
  .use(MOTOR, [ "P9_14", "P9_16" ], true)
  .use(MOTOR, [ "P8_13", "P8_19" ], true)
  .use(BATTERY, 'P9_40', 9.0, 12.3, 10, 25)
  .listen(1337, function(){
     console.log('Zetta is running at http://127.0.0.1:1337');
});
