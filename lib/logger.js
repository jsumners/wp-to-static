'use strict';

const argv = require('yargs').argv;
const isDebug = require('isdebug');

const log = require('console-log-level')({
  level: (isDebug) ? 'debug' : 'info',
  prefix: function prefix() {
    return `[${new Date().toISOString()}]`;
  }
});

if (argv.dump) {
  log.info = function(){};
}

module.exports = log;