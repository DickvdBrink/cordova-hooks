cordova-hooks
=============

A repository with example hooks used with cordova

Copy them in the .cordova/hooks/[event_name] folder and they are called automatically by cordova.

It currently contains the following hooks

* Compile TypeScript (before_prepare)
* Change index.html for a specific platform (before_prepare)
* Fix utf8 BOM for windows8 platform (after_prepare)
* Delete TypeScript files (pre_package)
* Prepare JavaScript files in www folder with istanbul for codecoverage (before_prepare)
* Prepare JavaScript files in platform www folder with istanbul for codecoverage (after_prepare)