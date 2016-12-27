let start = (() => {
    var _ref = _asyncToGenerator(function* () {
        if (process.env.NODE_ENV === 'development') {
            return startDevelopment();
        } else if (process.env.NODE_ENV === 'test') {
            return startTest();
        } else {
            return startProduction();
        }
    });

    return function start() {
        return _ref.apply(this, arguments);
    };
})();

let startTest = (() => {
    var _ref2 = _asyncToGenerator(function* () {
        return startProduction();
    });

    return function startTest() {
        return _ref2.apply(this, arguments);
    };
})();

let startDevelopment = (() => {
    var _ref3 = _asyncToGenerator(function* () {
        return startProduction();
    });

    return function startDevelopment() {
        return _ref3.apply(this, arguments);
    };
})();

let startProduction = (() => {
    var _ref4 = _asyncToGenerator(function* () {
        sub.on('message', function (channel, message) {
            if (process.env.formatter === 'jsome') {
                jsome(JSON.parse(message), {});
            } else if (process.env.formatter === 'prettyjson') {
                console.log(prettyjson.render(JSON.parse(message)));
            } else if (process.env.jsonIndent > 0) {
                console.log(JSON.stringify(JSON.parse(message), null, parseInt(process.env.jsonIndent)));
            } else if (process.env.reverseFile) {
                state.messages.splice(0, 0, JSON.parse(message));
                state.messages = state.messages.slice(0, 10);
                fs.writeFile(process.env.reverseFile, JSON.stringify(state.messages, null, 2));
            } else {
                console.log(message);
            }
        });
        sub.subscribe(config.subscribeChannel);
    });

    return function startProduction() {
        return _ref4.apply(this, arguments);
    };
})();

let end = (() => {
    var _ref5 = _asyncToGenerator(function* () {
        client.quit();
    });

    return function end() {
        return _ref5.apply(this, arguments);
    };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const assert = require('assert');
const fs = require('fs');
const lodash = require('lodash');
const Promise = require('bluebird');
const prettyjson = require('prettyjson');
const jsome = require('jsome');

const config = ['subscribeChannel'].reduce((config, key) => {
    assert(process.env[key], key);
    config[key] = process.env[key];
    return config;
}, {});
const redis = require('redis');
const sub = redis.createClient();

const state = {
    messages: []
};

assert(process.env.NODE_ENV);

start().then(() => {}).catch(err => {
    console.error(err);
    end();
}).finally(() => {});
