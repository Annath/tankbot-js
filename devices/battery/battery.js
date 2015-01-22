var Device = require('zetta-device');
var util = require('util');
var bone = require('bonescript');

var MAX_ADC_VOLTAGE = 1.8;

var Battery = module.exports = function(pin, maxVoltage, divisor, interval) {
    Device.call(this);
    this.pin = pin || 'P9_40';
    this.maxVoltage = maxVoltage || (12.1);
    this.divisor = divisor || (10);
    this.interval = interval || 250;
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
            
            self.linearPercent = (self.currentVoltage / self.maxVoltage) * 100;
        });

    }, self.interval);
}