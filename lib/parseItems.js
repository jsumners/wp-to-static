'use strict';

const path = require('canonical-path');
const log = require(path.join(__dirname, 'logger'));

module.exports = function parseItems(channel) {
  log.info('Parsing items into result objects');
  const result = {
    attachments: {},
    pages: {},
    posts: {}
  };

  function destKey(item) {
    return (item.postName) ? item.postName : item.title;
  }

  channel.item.forEach(function itemEach(item) {
    const key = destKey(item);
    switch (item.postType) {
      case 'attachment': {
        result.attachments[key] = item;
        break;
      }
      case 'page': {
        result.pages[key] = item;
        break;
      }
      case 'post': {
        result.posts[key] = item;
        break;
      }
    }
  });

  return result;
};