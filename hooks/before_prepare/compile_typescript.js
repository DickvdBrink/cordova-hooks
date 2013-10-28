#!/usr/bin/env node
/*
 * Compile TypeScript files in the www directory.
 * Copy this file in the .cordova/hooks/before_prepare so compiling is done before copying the files.
 */

var fs              = require('fs'),
    path            = require('path'),
    child_process   = require('child_process');

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

var files = walk('www', ['ts']).map(function(file) {
    return '"' + file + '"';
});

var options = '--target ES5';
fs.writeFileSync('buildfile', options + '\r\n' + files.join('\r\n'));
var process = child_process.spawn('tsc', ['@buildfile'], {
    stdio: 'inherit'
});