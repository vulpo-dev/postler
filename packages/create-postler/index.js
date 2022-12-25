#!/usr/bin/env node
let path = require("path")
let { main } = require("./lib/main")

let dir = path.dirname(__filename);
let templateDir = path.join(dir, "template");

main(templateDir).catch((err) => {
	console.log("Something went wrong");
	console.error(err);
});