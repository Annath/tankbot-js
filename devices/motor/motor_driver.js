var Device = require('zetta-device');
var util = require('util');
var bone = require('bonescript');

var Motor = module.exports = function(pins, invert) {
    Device.call(this);
    this.pins = pins || [ 'P8_13', 'P8_19' ]
    this.invert = invert || false
}

util.inherits(Motor, Device);

Motor.prototype.init = function(config) {
    var self = this;
    config
        .state('stopped')
        .type('motor')
        .name('MOTOR')
        .when('stopped', { allow: [ 'set-speed', 'set-inverted' ] })
        .when('running', { allow: [ 'set-speed', 'stop' ] })
        .map('stop', self.stop)
        .map('set-inverted', self.setInverted)
        .map('set-speed', self.setSpeed, [ { name: 'speed', type: 'number' } ])
        .monitor('speed');

    this.stop(function() {});
}

Motor.prototype.stop = function(cb) {
    var self = this;
    util.debug("Stopping...")
    bone.analogWrite(self.pins[0], 0, 2000, function() {
        bone.analogWrite(self.pins[1], 0, 2000, function() {
            self.state = 'stopped';
            self.speed = 0;
            cb();
        });
    });
};

Motor.prototype.setInverted = function(cb) {
    var self = this;
    self.invert = !self.invert;
    cb();
};

Motor.prototype.setSpeed = function(speed, cb) {
    var self = this;
    var pinA = 0;
    var pinB = 1;
    if (speed == 0) {
        self.stop(cb);
    } else {
        if ((speed < 0 && !self.invert) || (self.invert && speed > 0)) {
            pinA = 1;
            pinB = 0;
        }
        bone.analogWrite(self.pins[pinA], 0, 2000, function() {
            util.debug("Stopped pin " + self.pins[pinA].toString())
            bone.analogWrite(self.pins[pinB], (Math.abs(speed)/100), 2000, function() {

                util.debug("Set pin " + self.pins[pinB].toString() + " to " + (1/Math.abs(speed)));
                self.state = 'running';
                self.speed = speed;
                cb();
            });
        });
    }
};