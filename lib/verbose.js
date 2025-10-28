'use strict';

/* eslint no-console: "off" */

var enabled = false;

module.exports.setup = function (config) {
    enabled = (config && config.verbose === true) ? true : false;
};

// redact sensitive fields in objects before logging
function redactSensitive(obj) {
    if (obj && typeof obj === 'object') {
        var REDACT_FIELDS = ['password', 'applePassword', 'secret', 'apikey', 'api_key'];
        var copy = Array.isArray(obj) ? obj.slice() : Object.assign({}, obj);
        REDACT_FIELDS.forEach(function (field) {
            if (copy.hasOwnProperty(field)) {
                copy[field] = '[REDACTED]';
            }
        });
        return copy;
    }
    return obj;
}

module.exports.log = function () {
    if (!enabled) {
        return;
    }
    var logs = [];
    logs.push('[' + Date.now() + '][VERBOSE]');
    for (var i in arguments) {
        var arg = arguments[i];
        if (arg && typeof arg === 'object') {
            logs.push(redactSensitive(arg));
        } else {
            logs.push(arg);
        }
    }
    console.log.apply(console, logs);
};
