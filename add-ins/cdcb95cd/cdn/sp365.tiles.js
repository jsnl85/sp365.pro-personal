"use strict";
(function(_m) {
	var WebParts = _m.WebParts = _m.WebParts||{};
	WebParts.SmartTilesWebPart = _m.WebParts.SmartTilesWebPart = (function(_baseWp, $webpartConfig) {
		var _wp = this; _wp.base = _baseWp; for (var i in (_wp.base||{})) { _wp[i] = _wp.base[i]; } // extend 'this' object with same values as in the '_wp.base' variable
		var $wpConfig = $webpartConfig;
		var $ = null, angular = null;
		// 
		// auxiliaries
		var getTiles = function() { return (($wpConfig && $wpConfig.data && Array.isArray($wpConfig.data)) ? newResolvedPromise($wpConfig.data) : newResolvedPromise([])); }
		var renderLoading = function() {
			_wp.base.destroyRenderContainer(); var $container = _wp.base.getRenderContainer();
			$container.append(
				$('<div>').addClass('row-fluid').append(
					$('<div>').addClass('col-md-12').append(
						$('<div>').addClass('loading description').html(
							"Loading Tiles..."
						)
					)
				)
			);
		}
		var renderTiles = function(tiles) {
			_wp.base.destroyRenderContainer(); var $container = _wp.base.getRenderContainer();
			$container.append(
				$('<div>').addClass('row-fluid').append(
					$('<div>').addClass('col-md-12').append(
						(tiles|[]).map(function(obj){
							return $('<a>').prop('href',obj.url).append(
								$('<div>').addClass('tile').append(
									$('<div>').addClass('title').html(obj.title)
								)
							);
						})
					)
				)
			);
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
					renderLoading();
					// 
					getTiles().then(function(tiles) {
						try { renderTiles(tiles); }
						catch(ex) { reject(ex.message); }
					}, function(error) {
						logError('- Could not load the Tiles data.');
						reject(ex.message);
					});
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
