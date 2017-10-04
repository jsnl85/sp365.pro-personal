"use strict";
var SP365;
(function(SP365) {
	var log = SP365.log = function(msg) { if(window.console&&window.console.log)window.console.log(msg); }, logWarning = SP365.logWarning = log, logError = SP365.logError = log, logVerbose = SP365.logVerbose = function(msg) { if (/log|debug|verbose/gi.test(''+window.location)) { log(msg); } };
	var config = SP365.config = SP365.config||{}, version = config.version = config.version||'1.0.0.1';
	// 
	var init = function() {
		if (typeof(jQuery)=='undefined' || !jQuery.fn) {logError('jQuery is not included! Skipping SP365 init!');return;}
		// 
	}
	// 
	try { init(); }
	catch(ex) { logError('Unexpected error initializing \'sp365.js\'.'); }
})(SP365=(SP365||{})); // End of use strict
