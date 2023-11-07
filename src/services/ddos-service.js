const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');


const limiter = rateLimit({
    windowMs: 20 * 60 * 1000, //20 min in ms
    max: 150 // request / 20m
});

const slower = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 100,
    delayMs: 200
})

module.exports = [
    limiter,
    slower
]
