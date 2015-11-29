'use strict';

const path = require('canonical-path');
const log = require(path.join(__dirname, 'logger'));

module.exports = function parseCategories(channel) {
  log.info('Parsing categories into result object');
  const categories = {};

  if (!channel.category) {
    return categories;
  }

  if (Array.isArray(channel.category)) {
    for (let category of channel.category) {
      categories[category.categoryNicename] = category;
    }
  } else {
    categories[channel.category.categoryNicename] = channel.categories;
  }

  return categories;
};