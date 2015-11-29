'use strict';

let _config = {};
let _data = {};
const fs = require('fs');
const path = require('canonical-path');
const mkdirp = require('mkdirp');
const Handlebars = require('handlebars');
const log = require(path.join(__dirname, 'logger'));

function renderAttachments() {
  if (!_config.output.downloadAttachments) {
    return Promise.resolve();
  }

  const getAttachments = require(path.join(__dirname, 'getAttachments'));
  return getAttachments(_data.attachments, _config);
}

function processArticles(articles, type) { /* jshint -W071 */
  if (['pages', 'posts'].indexOf(type) === -1) {
    throw new Error('Invalid type supplied to processArticles');
  }
  const t = type.substr(0, type.length - 1); // singular
  const tmplPath = path.resolve(_config.tmpl.dir, _config.tmpl[t]);
  const templateSource = fs.readFileSync(tmplPath).toString();
  const template = Handlebars.compile(templateSource);

  for (let a of Object.keys(articles)) {
    const article = articles[a];
    const fname = path.join(
      _config.output.root,
      (t === 'page') ? _config.pageFilename(article) :
        _config.postFilename(article)
    );
    const context = (t === 'page') ?
      _config.pageParser(article, _data) : _config.postParser(article, _data);

    const dir = path.dirname(fname);
    mkdirp.sync(dir);

    try {
      const rendered = template(context);
      if (rendered) {
        log.info(`Writing ${t}: ${fname}`);
        const outstream = fs.createWriteStream(fname);
        outstream.end(rendered);
      }
    } catch (e) {
      log.error(`Could not write ${t}: ${fname}`);
      log.debug(e);
    }
  }
}

function writePages() {
  processArticles(_data.pages, 'pages');
  return Promise.resolve();
}

function writePosts() {
  processArticles(_data.posts, 'posts');
  return Promise.resolve();
}

module.exports = function render(data, config) {
  _config = config;
  _data = data;

  return renderAttachments()
    .then(writePages)
    .then(writePosts);
};