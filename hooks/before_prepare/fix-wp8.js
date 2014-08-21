#!/usr/bin/env node

/* 
 * Copy index.html to the windows8 merges folder and append the WinJS script tags to it. 
 * Copy this file in the .cordova/hooks/before_prepare so the index.html is created before copying the files. 
 */ 

var fs = require('fs'),
    path = require('path'),
    shelljs = require('shelljs'),
    cheerio = require('cheerio');


function createScriptElement(src) {
    return "\t<script type='text/javascript' src='" + src + "'></script>\r\n";
}

var content  = fs.readFileSync(path.join('www', 'index.html'), { encoding: 'utf8'});
$ = cheerio.load(content);

$("head").append(createScriptElement("//Microsoft.WinJS.1.0/js/base.js"));
$("head").append(createScriptElement("//Microsoft.WinJS.1.0/js/ui.js"));

var destination = path.join('merges', 'windows8', 'index.html');
shelljs.mkdir('-p', path.dirname(destination));

fs.writeFileSync(destination, $.html());
