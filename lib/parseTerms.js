'use strict';

const path = require('canonical-path');
const log = require(path.join(__dirname, 'logger'));

module.exports = function parseTerms(channel) {
  log.info('Parsing terms into result object');
  const terms = {};

  if (!channel.term) {
    return terms;
  }

  if (Array.isArray(channel.term)) {
    for (let term of channel.term) {
      terms[term.termId] = term;
    }
  } else {
    terms[channel.term.termId] = channel.term;
  }

  return terms;
};