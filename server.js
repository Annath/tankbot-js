var zetta = require('zetta');
var MOTOR = require('./devices/motor/index');

zetta()
  .name('FirstName-LastName')
  .use(MOTOR, [ "P9_14", "P9_16" ], true)
  .use(MOTOR, [ "P8_13", "P8_19" ], true)
  .listen(1337, function(){
     console.log('Zetta is running at http://127.0.0.1:1337');
});
