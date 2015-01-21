var zetta = require('zetta');
var MOTOR = require('./devices/motor/motor_driver');

zetta()
  .name('FirstName-LastName')
  .use(MOTOR, [ "P9_14", "P9_16" ], false)
  .listen(1337, function(){
     console.log('Zetta is running at http://127.0.0.1:1337');
});
