'use strict';
const fs = require('fs');
const expat = require('node-expat');
const Slicer = require('node-xml-slicer');
const path = require('canonical-path');
const libDir = path.resolve(path.join(__dirname, 'lib'));
const argv = require(path.join(libDir, 'clioptions'));
const log  = require(path.join(libDir, 'logger'));

const config = require(path.resolve(argv.config));
log.debug(config);

const parser = expat.createParser();
let slicedXml = null;

const readStream = fs.createReadStream(path.resolve(argv.file));

readStream.on('error', function readFileError(err) {
  console.error(err);
});

readStream.on('end', function readStreamDone() { /* jshint -W071 */
  readStream.unpipe(parser);

  const parseMeta = require(path.join(libDir, 'parseMetadata'));
  const parseCats = require(path.join(libDir, 'parseCategories'));
  const parseTags = require(path.join(libDir, 'parseTags'));
  const parseTerms = require(path.join(libDir, 'parseTerms'));
  const parseItems = require(path.join(libDir, 'parseItems'));

  const channel = slicedXml.result.rss.channel;
  const data = {};

  data.metadata = parseMeta(channel);
  data.catgories = parseCats(channel);
  data.tags = parseTags(channel);
  data.terms = parseTerms(channel);

  const parsedItems = parseItems(channel);
  Object.assign(data, parsedItems);

  if (argv.dump) {
    console.log(JSON.stringify(data, null, 2));
    process.exit();
  }

  require(path.join(libDir, '/render'))(data, config);
});

function fixKey(key) {
  function upit(match) {
    return match.toUpperCase()[1];
  }

  let _key = key;
  if (_key.startsWith('wp:')) {
    _key = _key.split(':')[1];
    _key = _key.replace(/_([a-z])/g, upit);
  } else if (_key.indexOf(':') !== -1) {
    _key = _key.replace(/:([a-z])/g, upit);
  }

  return _key;
}

function retype(val) {
  if (val.toLowerCase() === 'false' || val.toLowerCase() === 'true') {
    return (val.toLowerCase() !== 'false');
  }
  return (Number.isInteger(+val)) ? parseInt(val, 10) : val;
}

if (readStream) {
  const slicerOpts = {
    textAttrName: 'text',
    attrNameMutator: fixKey,
    propNameMutator: fixKey,
    valueMutator: retype
  };
  slicedXml = new Slicer(parser, null, slicerOpts);
  readStream.setEncoding('utf8');
  readStream.pipe(parser);
}