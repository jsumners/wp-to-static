'use strict';

const path = require('canonical-path');
const log = require(path.join(__dirname, 'logger'));

module.exports = function parseMetadata(channel) {
  log.info('Parsing metadata into result object');
  const metadata = {};

  metadata.title = channel.title;
  metadata.link = channel.link;
  metadata.description = channel.description;
  metadata.pubDate = channel.pubDate;
  metadata.language = channel.language;
  metadata.wxrVersion = channel.wxrVersion;
  metadata.baseSiteUrl = channel.baseSiteUrl;
  metadata.baseBlogUrl = channel.baseBlogUrl;
  metadata.generator = channel.generator;

  metadata.authors = {};
  if (Array.isArray(channel.author)) {
    for (let author of channel.author) {
      metadata.authors[author.login] = author;
    }
  } else {
    metadata.authors[channel.author.authorLogin] = channel.author;
  }

  return metadata;
};