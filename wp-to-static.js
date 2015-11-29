#!/usr/bin/env node

// This script is for node_modules/.bin/wp-to-static
'use strict';

const path = require('path');
const fs = require('fs');
const realPath = fs.realpathSync(__dirname);
const script = path.join(realPath, 'app.js');

require(script.toString());