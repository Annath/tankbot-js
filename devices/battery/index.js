var util = require('util');
var AutoScout = require('zetta-auto-scout');
var Motor = require('./battery');

var BoneScout = module.exports = function(pins, invert) {
  AutoScout.call(this, 'battery', Motor, pins, invert);
};
util.inherits(BoneScout, AutoScout);