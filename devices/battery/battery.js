var Device = require('zetta-device');
var util = require('util');
var bone = require('bonescript');

var MAX_ADC_VOLTAGE = 1.8;

var Battery = module.exports = function(pin, conf) {
    Device.call(this);
    this.pin = pin || 'P9_40';
    this.minVoltage = conf['minVoltage'] || (9.0);
    this.maxVoltage = conf['maxVoltage'] || (12.1);
    this.divisor = conf['divisor'] || (10);
    this.interval = conf['interval'] || 250;
}

util.inherits(Battery, Device);

Battery.prototype.init = function(config) {
    var self = this;
    config
        .state('ready')
        .type('battery')
        .name('BATTERY')
        .monitor('currentVoltage')
        .monitor('linearPercent');

    setInterval(function() {
        bone.analogRead(self.pin, function(raw) {
            if (raw.err) {
                return;
            }

            util.debug("RAW " + raw.value);
            var adcVoltage = (raw.value * MAX_ADC_VOLTAGE);
            util.debug("Read " + adcVoltage + " volts");
            
            self.currentVoltage = adcVoltage * self.divisor;
            util.debug("Battery is at " + self.currentVoltage + " volts");
            
            self.linearPercent = ((self.currentVoltage - self.minVoltage) / (self.maxVoltage - self.minVoltage)) * 100;
        });

    }, self.interval);
}