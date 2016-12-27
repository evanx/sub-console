const assert = require('assert');
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

assert(process.env.NODE_ENV);

async function start() {
    if (process.env.NODE_ENV === 'development') {
        return startDevelopment();
    } else if (process.env.NODE_ENV === 'test') {
        return startTest();
    } else {
        return startProduction();
    }
}

async function startTest() {
    return startProduction();
}

async function startDevelopment() {
    return startProduction();
}

async function startProduction() {
    sub.on('message', (channel, message) => {
        if (process.env.formatter === 'jsome') {
            jsome(JSON.parse(message));
        } else if (process.env.formatter === 'prettyjson') {
            console.log(prettyjson.render(JSON.parse(message)));
        } else if (process.env.jsonIndent > 0) {
            console.log(JSON.stringify(JSON.parse(message), null, parseInt(process.env.jsonIndent)));
        } else {
            console.log(message);
        }
    });
    sub.subscribe(config.subscribeChannel);
}

async function end() {
    client.quit();
}

start().then(() => {
}).catch(err => {
    console.error(err);
    end();
}).finally(() => {
});
