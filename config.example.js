'use strict';

const os = require('os');
const path = require('canonical-path');
const md = require('node-markdown').Markdown;
const config = {};

// The `tmpl` property contains all settings related to templates
config.tmpl = {};
// Directory that contains the templates that will be used
config.tmpl.dir = path.join(__dirname, 'templates');
// Template that will be used to render "page" item types
config.tmpl.page = 'default.html';
// Template that will be used to render "post" item types
config.tmpl.post = 'default.html';

// The `output` property contains all settings governing output
config.output = {};
// The root directory for all output
config.output.root = path.join(os.tmpdir(), 'wp-to-static');
// Set to false to skip downloading attachments from your live Wordpress
// instance
config.output.downloadAttachments = true;
// Directory where attachments will be downloaded to
config.output.attachmentsDir =
  path.join(config.output.root, 'wp-content', 'uploads');

// Invoked to determine the output file for a given post. This file will
// be written relative to `config.output.root`. For example, if
// `config.output.root = /tmp/dump`, and this method returns foo/bar.html,
// then the output file will be `/tmp/dump/foo/bar.html`.
config.postFilename = function postFilename(post) {
  // For 'http://jrfom.com/2015/01/15/foo-title/' return
  // '2015/01/15/foo-title/index.html'
  let file = post.link.replace('http://jrfom.com/', '');
  return `${file}/index.html`;
};

// Same as `postFilename` except for pages.
config.pageFilename = function pageFilename(page) {
  return config.postFilename(page);
};

// Invoked when a post is about to be rendered. This allows you
// to manipulate the post data prior to it being submitted to Handlebars.
// For example, your might need to do something with the post's
// `contentEncoded` attribute to prepare it for the template engine.
//
// This method should return an object with all properties necessary for your
// post template. The returned object will be passed to Handlebars as the
// template context.
//
// The `fullData` parameter includes all of the information from the XML
// document. This gives you access to things like the site's metadata.
config.postParser = function postParser(post, fullData) {
  const body = (post.contentEncoded) ? md(post.contentEncoded) : '';
  const comments = commentsParser(post.comment);
  const categories = (Array.isArray(post.category)) ?
    post.category : [post.category]
  return {
    title: post.title,
    body: body,
    comments: comments,
    categories: categories,
    metadata: fullData.metadata,
    srcData: post
  };
};

// Same thing as `postParser` except for pages.
config.pageParser = function pageParser(page, fullData) {
  return config.postParser(page, fullData);
};

function commentsParser(comments) {
  // This function takes the tinymce formatted content that are Wordpress
  // comments and treats them like Markdown to get an HTML representation.
  // This is nowhere near comprehensive, but I don't want to deal with it
  // any further.
  if (!comments) {
    return [];
  }
  const _comments = (Array.isArray(comments)) ? comments : [comments];
  const result = [];
  for (let c of _comments) {
    if (c.commentApproved !== '1') {
      continue;
    }
    const _c = Object.assign({}, c);
    _c.commentContent = md(c.commentContent);
    result.push(_c);
  }
  return result;
}

module.exports = config;