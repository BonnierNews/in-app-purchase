'use strict';

/* eslint no-console: "off" */

var enabled = false;

module.exports.setup = function (config) {
    enabled = (config && config.verbose === true) ? true : false;
};

// redact sensitive fields in objects before logging
function redactSensitive(obj) {
    var REDACT_FIELDS = ['password', 'applePassword', 'secret', 'apikey', 'api_key'];
    // Helper to check if a key is considered sensitive
    function isSensitive(key) {
        return REDACT_FIELDS.some(function (field) {
            return key && typeof key === 'string' && key.toLowerCase() === field.toLowerCase();
        });
    }
    // Deep-copy and redact recursively
    function deepRedact(item) {
        if (Array.isArray(item)) {
            return item.map(deepRedact);
        } else if (item && typeof item === 'object' && item.constructor === Object) {
            var result = {};
            for (var key in item) {
                if (Object.prototype.hasOwnProperty.call(item, key)) {
                    if (isSensitive(key)) {
                        result[key] = '[REDACTED]';
                    } else {
                        result[key] = deepRedact(item[key]);
                    }
                }
            }
            return result;
        }
        return item;
    }
    return deepRedact(obj);
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
