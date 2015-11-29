'use strict';

const fs = require('fs');
const path = require('canonical-path');
const mkdirp = require('mkdirp-then');
const wreck = require('wreck');

const log = require(path.join(__dirname, 'logger'));

module.exports = function(attachments, config) {
  const destDir = path.resolve(config.output.attachmentsDir);

  function ad(err, res, payload) {
    const basename = path.basename(res.req.path);
    if (err) {
      log.info(`Download failure: ${basename}`);
      log.debug(err);
      return;
    }
    const filename = path.join(destDir, basename);
    const outstream = fs.createWriteStream(filename);
    outstream.end(payload);
    log.info(`Download success: ${basename}`);
  }

  return mkdirp(destDir).then(function downloadAttachments() {
    for (let key of Object.keys(attachments)) {
      const url = attachments[key].attachmentUrl;
      log.info(`Downloading attachment ${url}`);
      wreck.get(url, {}, ad);
    }
    return Promise.resolve();
  });
};