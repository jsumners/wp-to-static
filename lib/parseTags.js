'use strict';

const path = require('canonical-path');
const log = require(path.join(__dirname, 'logger'));

module.exports = function parseTerms(channel) {
  log.info('Parsing tags into result object');
  const tags = {};

  if (!channel.term) {
    return tags;
  }

  if (Array.isArray(channel.tag)) {
    for (let tag of channel.tag) {
      tags[tag.tagSlug] = tag;
    }
  } else {
    tags[channel.term.tagSlug] = channel.tag;
  }

  return tags;
};