#!/usr/bin/env node

var cordovaLib = require("cordova/node_modules/cordova-lib");
var path            = require("path"),
    fs              = require("fs"),
    minimatch       = require("minimatch"),
    istanbul        = require("istanbul");

var excluded = ["**/cordova.js", "**/cordova_plugins.js"];

var instrumenter = new istanbul.Instrumenter();

var platforms = process.env.CORDOVA_PLATFORMS.split(",");
var cordovaPlatforms = cordovaLib.cordova_platforms;
var projectRoot = process.cwd();

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

platforms.forEach(function(platform) {
    if(!cordovaPlatforms[platform]) {
        console.log("Unknown platform: " + platform);
        return;
    }

    var platformPath = null;
    if(cordovaPlatforms[platform].subdirectory) {
        platformPath = path.resolve(path.join('platforms', cordovaPlatforms[platform].subdirectory));
    } else {
        platformPath = path.resolve(path.join('platforms', platform));
    }

    var parser = new cordovaPlatforms[platform].parser(platformPath);

    var files = walk(parser.www_dir(), ["js"])
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
});
