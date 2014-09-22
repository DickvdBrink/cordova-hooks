#!/usr/bin/env node

/*
 * Instrument the JavaScript code with istanbul for code coverage testing
 */

var fs              = require('fs'),
    path            = require('path'),
    minimatch       = require("minimatch"),
    istanbul        = require('istanbul');

var excluded = ["**/jquery/*", "**/tests/*", "**/libs/*"];

var walk = function(dir, extensions) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        var stat = fs.statSync(file);
        // Check given directory recursive.
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file, extensions));
        } else {
            var extension = path.extname(file);
            if (extension === '' || !Array.isArray(extensions) || extensions.indexOf(extension.substring(1)) > -1) {
                results.push(file);
            }
        }
    });
    return results;
}

var instrumenter = new istanbul.Instrumenter();

var files = walk('www', ['js'])
.filter(function(item) {
    return !excluded.some(function(pattern) {
        return minimatch(item, pattern, { nocase: true });
    });
})
.forEach(function(filename) {
    var file = fs.readFileSync(filename, "utf8");
    var output = instrumenter.instrumentSync(file, filename);
    fs.writeFileSync(filename, output);
});
