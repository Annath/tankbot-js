var util = require('util');
var AutoScout = require('zetta-auto-scout');
var Motor = require('./motor_driver');

var BoneScout = module.exports = function(pins, invert) {
  AutoScout.call(this, 'motor', Motor, pins, invert);
};
util.inherits(BoneScout, AutoScout);