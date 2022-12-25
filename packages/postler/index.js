#!/usr/bin/env node
let { runCli } = require('./lib/main.js');
let path = require("path");

let POSTLER_PREVIEW_DIR = path.dirname(require.resolve("postler-preview/package.json"));

runCli(POSTLER_PREVIEW_DIR)
