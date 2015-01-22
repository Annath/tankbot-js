var Device = require('zetta-device');
var util = require('util');
var bone = require('octalbonescript');

var Motor = module.exports = function(pins, invert) {
    Device.call(this);
    this.pins = pins || [ 'P8_13', 'P8_19' ]
    this.invert = invert || false
}

util.inherits(Motor, Device);

Motor.prototype.init = function(config) {
    config
        .state('stopped')
        .type('motor')
        .name('MOTOR')
        .when('stopped', { allow: [ 'set-speed' ] })
        .when('running', { allow: [ 'set-speed', 'stop' ] })
        .map('stop', this.stop)
        .map('set-speed', this.setSpeed, [ { name: 'speed', type: 'int' } ]);

    bone.pinMode(this.pins[0], bone.OUTPUT, function() {})
    bone.pinMode(this.pins[1], bone.OUTPUT, function() {})
    this.stop(function() {});
}

Motor.prototype.stop = function(cb) {
    var self = this;
    util.debug("Stopping...")
    bone.digitalWrite(self.pins[0], 0, function() {
        bone.digitalWrite(self.pins[1], 0, function() {
            self.state = 'stopped';
            self.speed = 0;
            cb();
        });
    });
};

Motor.prototype.setSpeed = function(speed, cb) {
    var self = this;
    var pinA = 0;
    var pinB = 1;
    if (speed == 0) {
        self.stop(cb);
    } else {
        if (speed < 0 || self.invert) {
            pinA = 1;
            pinB = 0;
        }
        bone.digitalWrite(self.pins[pinA], 0, function() {
            bone.analogWrite(self.pins[pinB], (1/Math.abs(speed)), 2000, function() {
                self.state = 'running';
                self.speed = speed;
                cb();
            });
        });
    }
};