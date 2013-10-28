#!/usr/bin/node
/*
 * Remove all .ts files from the platforms directory. Which are copied here by cordova prepare.
 * Copy this file in the .cordova/hooks/pre_package for Windows Phone or the project file will be generated with the content tags for the typescript files.
 * Doesnt work with cordova 3.1, because it doesn't have the pre_package hook.
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