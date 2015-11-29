'use strict';
const yargs = require('yargs');

yargs
  .options({
    genconfig: {
      alias: 'g',
      describe: 'Print the default config.js to stdout',
      demand: false,
      type: 'boolean'
    },

    gentmpl: {
      alias: 't',
      describe: 'Print the default template to stdout',
      demand: false,
      type: 'boolean'
    }
  })
  .help('help');

let argv = yargs.argv;
if (argv.genconfig) {
  require(__dirname + '/gendefaults')('config');
  process.exit();
} else if (argv.gentmpl) {
  require(__dirname + '/gendefaults')('tmpl');
  process.exit();
}

yargs
  .reset()
  .options({
    dump: {
      alias: 'd',
      describe: 'Parses the XML and dumps it as a JSON representation to stdout',
      demand: false,
      type: 'boolean'
    },

    file: {
      alias: 'f',
      describe: 'Wordpress export XML file to parse',
      type: 'string'
    },

    config: {
      alias: 'c',
      describe: 'JavaScript or JSON file to read for configuration settings',
      type: 'string'
    }
  })
  .implies('file', 'config')
  .implies('config', 'file')
  .help('help');

argv = yargs.argv;

module.exports = argv;