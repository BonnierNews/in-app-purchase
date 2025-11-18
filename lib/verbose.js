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

// Helper to redact sensitive data from strings
function redactStringSensitive(str) {
    if (typeof str !== 'string') return str;
    // Match if string contains any sensitive field
    var REDACT_FIELDS = ['password', 'applePassword', 'secret', 'apikey', 'api_key'];
    for (var i = 0; i < REDACT_FIELDS.length; ++i) {
        // case-insensitive match for keyword followed by possible separator and value (e.g., 'password: ...')
        var field = REDACT_FIELDS[i];
        var re = new RegExp(field + '\\s*[:=]\\s*[^\\s]+', 'i');
        if (re.test(str)) {
            // Replace the sensitive value with '[REDACTED]'
            str = str.replace(re, field + ': [REDACTED]');
        }
    }
    return str;
}

module.exports.log = function () {
    if (!enabled) {
        return;
    }
    var logs = [];
    logs.push('[' + Date.now() + '][VERBOSE]');
    for (var i in arguments) {
        var arg = arguments[i];
        var out;
        if (arg && typeof arg === 'object') {
            // Handle plain object, array, or other objects
            try {
                out = JSON.stringify(redactSensitive(arg));
            } catch (e) {
                // fallback for objects that can't be stringified
                out = '[Unserializable Object]';
            }
        } else if (typeof arg === 'string') {
            out = redactStringSensitive(arg);
        } else {
            // For all other primitives, convert to string and redact
            out = redactStringSensitive(String(arg));
        }
        logs.push(out);
    }
    console.log.apply(console, logs);
};
