"use strict";
(function(_m) {
	var WebParts = _m.WebParts = _m.WebParts||{};
	WebParts.SmartTilesWebPart = _m.WebParts.SmartTilesWebPart = (function(_baseWp, $webpartConfig) {
		var _wp = this; _wp.base = _baseWp; for (var i in (_wp.base||{})) { _wp[i] = _wp.base[i]; } // extend 'this' object with same values as in the '_wp.base' variable
		var $wpConfig = $webpartConfig;
		var $ = null, angular = null;
		// 
		// auxiliaries
		var getRenderContainer = function() {
			var $parent = $wpConfig.closest('[webpartid]').parent(), $container = $parent.find('.sp365-wp-container');
			if($container.length == 0) { $container = $('<div>').addClass('sp365-wp-container').addClass('container-fluid'); $parent.append($container); }
			return $container;
		}
		var destroyRenderContainer = function() {
			var $parent = $wpConfig.closest('[webpartid]').parent(), $container = $parent.find('.sp365-wp-container');
			$container.detach();
		};
		var render = function() {
			var $container = getRenderContainer();
			// 
		}
		// 
		// override methods
		var init = _wp.init = function(initBaseQ) {
			var promise = newPromise(function(resolve, reject) {
				_m.logVerbose('- initialising SmartTilesWebPart on \''+ $wpConfig +'\'.');
				// 
				_m.allPromise([_m.requireJQuery(), _m.requireAngular()]).then(function(result) {
					$ = result[0], angular = result[1];
					// 
					try { render(); }
					catch(ex) { reject(ex.message); }
					// 
					_m.log('- inited a new instance of SmartTilesWebPart on \''+ $wpConfig +'\'.');
					resolve();
				}, reject);
			});
			return promise;
		}
		var destroy = _wp.destroy = function() { return newPromise(function(resolve, reject) { _wp.super.destroy().then(function() { destroyRenderContainer(); resolve(_wp); }, reject); }); }
	});
})(window.SP365=(window.SP365||{}));
