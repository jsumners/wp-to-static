'use strict';

module.exports = function gendefaults(def) {
  const fs = require('fs');
  const path = require('canonical-path');
  const filename = (function() {
    if (def === 'config') {
      return path.join(__dirname, '..', 'config.example.js');
    }
    return path.join(__dirname, '..', 'templates', 'default.html');
  }());
  const file = fs.readFileSync(filename);

  console.log(file.toString());
};