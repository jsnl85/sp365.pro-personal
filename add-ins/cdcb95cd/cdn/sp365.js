"use strict";
(function(_m) {
	var baseScriptFolderPath = 'https://sp365.pro/add-ins/cdcb95cd/cdn/', baseScriptPath = baseScriptFolderPath+'sp365.min.js', scriptVersion = '1.0.0.0';
	var log = _m.log = function(msg) { if(window.console&&window.console.log)window.console.log(msg); }, logWarning = _m.logWarning = log, logError = _m.logError = log, logVerbose = _m.logVerbose = function(msg) { if (/log|debug|verbose/gi.test(''+window.location)) { log(msg); } };
	var config = _m.config = _m.config||{}, version = config.version = config.version||scriptVersion;
	// 
	// Auxiliaries
	var isDebugQ = function(){return !!/debug/gi.test(''+window.location);};
	if(isDebugQ()) { logVerbose = _m.logVerbose = log; }
	// 
	// Promises support
	function SimplePromise(resolvableAction) {
		var _this = this, _thens = [], _complete = function(which, arg1, arg2, arg3, arg4) {
			_this.then = ((which === 'resolve') ? function(resolve, reject) { resolve && resolve(arg1, arg2, arg3, arg4); } : function(resolve, reject) { reject && reject(arg1, arg2, arg3, arg4); }); // switch over to sync then()
			_this.resolve = _this.reject = function() { throw new Error('Promise already completed.'); }; // disallow multiple calls to resolve or reject
			var aThen, i = 0; while (aThen = _thens[i++]) { aThen[which] && aThen[which](arg1, arg2, arg3, arg4); } // complete all waiting (async) then()s
			_thens = []; //delete _thens;
		};
		// 
		_this.then = function(onResolve, onReject) {
			_thens.push({ resolve: onResolve, reject: onReject }); // capture calls to then()
		};
		_this.resolve = function(arg1, arg2, arg3, arg4) {
			_complete('resolve', arg1, arg2, arg3, arg4);
		};
		_this.reject = function(arg1, arg2, arg3, arg4) {
			_complete('reject', arg1, arg2, arg3, arg4);
		};
		// 
		if (typeof(resolvableAction) == 'function') {
			setTimeout(function() { resolvableAction(_this.resolve, _this.reject); }, 0);
		}
	}
	var newResolvedPromise = _m.newResolvedPromise = function(result) { return newPromise(function(resolve, reject) { resolve(result); }); }
	var newRejectedPromise = _m.newRejectedPromise = function(result) { return newPromise(function(resolve, reject) { reject(result); }); }
	var newPromise = _m.newPromise = function(resolvableAction) {
		var promise = null; 
		if (typeof(Promise) == 'function') { promise = new Promise(resolvableAction); }
		//else if (typeof(jQuery)=='function'&&typeof(jQuery().promise)=='function') { promise = jQuery().promise(resolvableAction); }
		else { promise = new SimplePromise(resolvableAction); }
		return promise;
	}
	var allPromise = _m.allPromise = function(promises, options) {
		var alwaysResolveQ = (options||{}).alwaysResolveQ;
		var isPromiseQ = function(promise) { return (promise && typeof(promise.then) == 'function'); } // NOT perfect... I know...
		if (alwaysResolveQ === undefined && typeof(Promise) == 'function') { return Promise.all(promises); }
		//else if (alwaysResolveQ === undefined && typeof(jQuery)=='function'&&typeof(jQuery().promise)=='function') { return jQuery.when.apply(jQuery, promises); }
		else if (promises && promises.length > 0) {
			var singlePromiseWithOutcomes = newPromise(function(resolve, reject) {
				var len = (0 + promises.length), outcomes = [], outcomesDefined = [];
				var allOutcomesComplete = function() { for (var i = 0; i < len; i++) { if (outcomesDefined[i] !== true) { return false; } } return true; };
				for (var i = 0; i < promises.length; i++) {
					var promise = promises[i];
					if (isPromiseQ(promise)) {
						(function(refI) {
							promise.then(function(val) {
								logVerbose('- resolved during an allPromise(promises) call.');
								outcomes[refI] = val; outcomesDefined[refI] = true;
								if (allOutcomesComplete()) { resolve(outcomes); }
							}, function(error) {
								logVerbose('- rejection during an allPromise(promises) call.');
								if (alwaysResolveQ == true) {
									outcomes[refI] = error; outcomesDefined[refI] = true;
									if (allOutcomesComplete()) { resolve(outcomes); }
								}
								else { reject(error); }
							});
						})(i);
					}
					else {
						outcomes[refI] = promise; outcomesDefined[refI] = true;
						resovleAllIfComplete();
					}
				}
			});
			return singlePromiseWithOutcomes;
		}
		else { return newResolvedPromise(); }
	}
	// 
	var _requireCache = []; // {id:'Sample',exports:null}
	var require = _m.require = function(scriptId, scriptSrc, asyncQ) {
		var promise = newPromise(function(resolve, reject){
			scriptSrc=((scriptSrc!==undefined)?scriptSrc:scriptId);
			scriptId=(/([^/\\?]+)(\?|$)/gi.exec(scriptId)[1]||scriptId).replace(/(\.min)?(\.js)?/gi,'').replace(/[^a-z0-9]/gi,'_').toLowerCase(); if(!scriptId){reject('Please provide a valid \'scriptId\'.');return;}
			if(asyncQ===undefined){asyncQ=true;}
			var isCSS = !!(/[.]css[^/]*$/gi.test(scriptSrc));
			var elId = (isCSS ? 'CSS_'+scriptId : 'JS_'+scriptId);
			// 
			var c = _requireCache.filter(function(_){return _ && _.id==scriptId;})[0];
			var isNewQ = !c;
			if (isNewQ) {
				if(!scriptSrc) { reject('Cannot complete require for scriptId \''+ scriptId +'\' because no \'scriptSrc\' was provided.'); return; }
				c = {id:scriptId,src:scriptSrc,module:undefined}; _requireCache.push(c);
			}
			// 
			var handleErrors = function(r) {
				logError('Could not load scriptId \''+ scriptId +'\' from scriptSrc \''+ scriptSrc +'\'. Error: '+(r||{}).statusText||(r||{}).message||'');
				reject(null);
				//try {
					//if (document.readyState === 'complete') { reject(null); }
					//else {
					//	if (isCSS) { document.write('<link id="'+ elId +'" rel="stylesheet" type="text/css" href="'+scriptSrc+'"></'+'link>'); }
					//	else { document.write('<script id="'+ elId +'" type="text/javascript" src="'+scriptSrc+'"></'+'script>'); }
					//}
				//}
				//catch(ex) { reject(ex); }
			}
			var handleLoad = function(r) {
				var script = (r.responseText||'');
				logVerbose('- retrieved scriptId \''+ scriptId +'\' from \''+ scriptSrc +'\' with length \''+ script.length +'\'.');
				var m=(function(s){
					var module={exports:{}};
					var customDefineQ = false;
					if (!window.define) {
						window.define = (function() {
							var scriptIds = arguments[0];
							scriptIds = (typeof(scriptIds)=='string'?[scriptIds]:(scriptIds||[]));
							var callback = function(){}; if (arguments.length > 1) { arguments[arguments.length-1]; }
							var requiredPromises = (scriptIds||[]).map(require);
							allPromise(requiredPromises).then(function(requiredModules) {
								callback.apply(null, requiredModules);
							}, reject);
						});
						window.define.amd = true;
						customDefineQ = true;
					}
					try { eval('(function(module,exports){ '+ s +' })(module,module.exports);'); }
					catch(ex) { eval(s); }
					if (customDefineQ == true) { delete window.define; }
					return module;
				})(script);
				var c = _requireCache.filter(function(_){return _ && _.id==scriptId;})[0];
				c.module = m; //c.exports = m.exports;
				resolve(m.exports);
			}
			try {
				if (isCSS) {
					if (!document.getElementById(elId)) {
						var head = document.getElementsByTagName('head')[0];
						var link = document.createElement('link'); link.id = elId; link.rel = 'stylesheet'; link.type = 'text/css'; link.href = scriptSrc; //link.media = 'all';
						head.appendChild(link);
					}
					else { logVerbose('- already included CSS \''+ scriptId +'\' from \''+ scriptSrc +'\''); }
					// 
					resolve();
				}
				else {
					if(isNewQ) {
						var r=(typeof(XMLHttpRequest)?new XMLHttpRequest():typeof(createXMLHTTPObject)=='function'?createXMLHTTPObject():null);r.open('GET',scriptSrc,asyncQ);
						r.onload = function (e) {
							if (r.readyState === 4) {
								if (r.status === 200) { handleLoad(r); }
								else { handleErrors(r); }
							}
						};
						r.onerror = function (e) { handleErrors(r); };
						r.send(null);
					}
					else {
						var waitUntilModuleLoaded = ((c && c.module) ? newResolvedPromise(c.module) : newPromise(function(resolve, reject) {
							logVerbose('- waiting until scriptId \''+ scriptId +'\' is loaded.');
							(function() {
								var timeoutI = 0, timeoutId = null;
								var checkModule = function() {
									var c = _requireCache.filter(function(_){return _ && _.id==scriptId;})[0];
									if (c && c.module) { resolve(c.module); }
									else if(timeoutI++ < 30) { logVerbose('- waiting for scriptId \''+ scriptId +'\'.'); timeoutId = window.setTimeout(checkModule, 100); }
									else { reject('Waited for too long for scriptId \''+ scriptId +'\'.'); }
								};
								timeoutId = window.setTimeout(checkModule, 100);
							})();
						}));
						waitUntilModuleLoaded.then(function(module) {
							logVerbose('- already included \''+ scriptId +'\'.');
							resolve(module.exports);
						}, reject);
				}
				}
			}
			catch(ex) { handleErrors(ex); }
		});
		return promise;
	};
	var requireJQuery = _m.requireJQuery = function() { if (typeof(jQuery) != 'undefined') { return newResolvedPromise(jQuery); } return require('jquery', '//code.jquery.com/jquery.min.js', true); }
	var requireJQueryUI = _m.requireJQueryUI = function() { if (typeof(jQuery) != 'undefined' && jQuery.ui) { return newResolvedPromise(jQuery.ui); } return allPromise([require('jquery-ui.css', '//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.min.css', true), newPromise(function(resolve, reject) { requireJQuery().then(function($) { require('jquery-ui', '//code.jquery.com/ui/1.12.1/jquery-ui.min.js', true).then(resolve, reject); }); })]); }
	var requireAngular = _m.requireAngular = function() { if (typeof(angular) != 'undefined' && angular) { return newResolvedPromise(angular); } return require('angular', '//ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js', true); }
	var requireSPJS = _m.requireSPJS = function() { if (typeof(SP) != 'undefined') { return newResolvedPromise(SP); } else { return require('sp.js', getPageInfo(false).webAbsoluteUrl+'/_layouts/15/sp.js', true); } }
	var requireSPRequestExecutor = _m.requireSPRequestExecutor = function() { if (typeof(SP) != 'undefined' && SP.RequestExecutor) { return newResolvedPromise(SP.RequestExecutor); } else { return require('sp.requestexecutor', getPageInfo(false).webAbsoluteUrl+'/_layouts/15/SP.RequestExecutor.js', true); } }
	var requireSPClientContext = _m.requireSPClientContext = function() { return newPromise(function(resolve, reject) { requireSPJS().then(function() { if (typeof(SP) != 'undefined' && SP.SOD) { SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function() { resolve(); }); } else { reject() } }, reject); }); }
	// 
	var newId = _m.newId = function(len) {
		var ret = '';
		if (!len) { len = 4; }
		while (ret.length < len) { ret += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); }
		return ((ret.length > len) ? ret.substring(0, len) : ret);
	};
	var newGuid = _m.newGuid = function() {
		return (newId(8) + '-' + newId(4) + '-' + newId(4) + '-' + newId(4) + '-' + newId(12));
	};
	var newElementId = _m.newElementId = function() {
		return (newId(8) + '_' + newId(4) + '_' + newId(4) + '_' + newId(4) + '_' + newId(12));
	};
	var getIncludedStyle = _m.getIncludedStyle = function(stylesheetId) {
		var ret = null;
		var styles = document.getElementsByTagName("style");
		for (var i = 0; i < styles.length; i++) {
			var style = styles[i];
			if (style.id == stylesheetId) { ret = style; break; }
		}
		return ret;
	}
	var includeStyle = _m.includeStyle = function(stylesheetId, stylesheetBody) {
		if (!stylesheetId || !stylesheetBody) { return; }
		try {
			var elStyle = getIncludedStyle(stylesheetId);
			if (!elStyle) {
				elStyle = document.createElement('style'); elStyle.id = stylesheetId; elStyle.type = "text/css";
				if (elStyle.styleSheet) { elStyle.styleSheet.cssText = stylesheetBody; } else { elStyle.appendChild(document.createTextNode(stylesheetBody)); }
				var elHead = document.getElementsByTagName('head')[0];
				logVerbose('includeStyle() - Loaded Style \'' + stylesheetId + '\'');
				elHead.appendChild(elStyle);
			}
			else {
				if (elStyle.styleSheet) { elStyle.styleSheet.cssText = stylesheetBody; } else { if (elStyle.firstChild) { elStyle.removeChild(elStyle.firstChild); } elStyle.appendChild(document.createTextNode(stylesheetBody)); }
				logVerbose('includeStyle() - Already referenced Style \'' + stylesheetId + '\'');
			}
		}
		catch (ex) { logError('includeStyle() - Unexpected error: ' + ex, 'Error'); }
	};
	var removeStyle = _m.removeStyle = function(stylesheetId) {
		if (!stylesheetId) { return; }
		var elStyle = getIncludedStyle(stylesheetId);
		if (elStyle) { elStyle.parentNode.removeChild(elStyle); }
	}
	var showProgress = _m.showProgress = function($el, showQ, color, label) {
		ensureJQuery(function() {
			$el = ($el || $('body'));
			showQ = (showQ == undefined || showQ) ? true : false;
			// 
			// COMMENTED: previous solution dependent on kendo.ui
			//if(typeof(kendo)!='undefined' && kendo.ui && kendo.ui.progress) { kendo.ui.progress($el, showQ); }
			// 
			var count = parseInteger($el.attr('showProgressCount')||'0');
			if (showQ) {
				$el.attr('showProgressCount', '' + (count + 1));
				if (count > 0) { return; } // already showing...
				// 
				var $elLoading = $el.find('.loading,.loading-progress');
				if ($elLoading.length > 0) { $elLoading.show(); }
				else {
					// CSS-only solution
					if (!color) { color = 'rgb(51,51,51)'; } // #337ab7
					if (label == undefined) { label = 'Loading...'; }
					includeStyle('loading-progress-style', '\
.loading-progress{display:flex;align-items:center;position:fixed;top:0px;left:0px;z-index:100;width:100%;height:100%;background-color:#fff;filter:alpha(opacity=30);opacity:.3;}\
.loader,.loader:before,.loader:after{background:'+ color + ';-webkit-animation:load1 1s infinite ease-in-out;animation:load1 1s infinite ease-in-out;width:1em;height:4em;}\
.loader{color:'+ color + ';text-indent:-9999em;margin:auto;font-size:11px;-webkit-transform:translateZ(0);-ms-transform:translateZ(0);transform:translateZ(0);-webkit-animation-delay:-0.16s;animation-delay:-0.16s;}\
.loader:before,.loader:after{position:absolute;top:0;content:\'\';}\
.loader:before{left:-1.5em;-webkit-animation-delay:-0.32s;animation-delay:-0.32s;}\
.loader:after{left:1.5em;}\
@-webkit-keyframes load1{\
 0%,80%,100%{box-shadow:0 0;height:4em;}\
 40%{box-shadow:0 -2em;height:5em;}\
}\
@keyframes load1{\
 0%,80%,100%{box-shadow:0 0;height:4em;}\
 40%{box-shadow:0 -2em;height:5em;}\
}\
'
					);
					$el.prepend('<div class="loading-progress"><div class="loader loading-label">' + label + '</div></div>');
				}
			}
			else {
				$el.attr('showProgressCount', '' + ((count > 0) ? (count - 1) : 0));
				if (count > 1) { return; } // need to keep it showing...
				// 
				var $elLoading = $el.find('.loading');
				if ($elLoading.length > 0) { $elLoading.hide(); }
				else {
					$elLoading = $el.find('.loading-progress');
					$elLoading.detach();
				}
			}
		});
	}
	var hideProgress = _m.hideProgress = function($el) { showProgress($el, false); }
	// 
	var tryParseJson = _m.tryParseJson = function(json) { var ret; try{ ret = JSON.parse(json); } catch(ex) { logVerbose('- could not parse JSON \''+ json +'\'. Error: '+ ex.message); } return ret; };
	var trySerialiseJson = _m.tryParseJson = function(json) { var ret; try{ ret = JSON.stringify(json); } catch(ex) { logVerbose('- could not serialise object to JSON \''+ json +'\'. Error: '+ ex.message); } return ret; };
	// 
	var WebParts = _m.WebParts = _m.WebParts||{};
	WebParts.BaseWebPart = _m.WebParts.BaseWebPart = (function($webpartConfig){
		// local variables
		var _wp = this, _childWp = null;
		var $wpConfig = $webpartConfig;
		var $ = null;
		// 
		// methods
		var getConfig = _wp.getConfig = function() { return tryParseJson($wpConfig.attr('sp365-wp')); }
		var setConfig = _wp.setConfig = function(wpConfig) { var json = trySerialiseJson(wpConfig); if (json) { $wpConfig.attr('sp365-wp', json); } else { logWarning('- Could not set the BaseWebPart config because wpConfig could not be serialised to JSON.'); if (!isEditableQ()) { logVerbose('- NOTE: a call to BaseWebpart.setConfig() was done, but content is not editable.'); } } }
		var isEditableQ = _wp.isEditableQ = function() { return tryParseJson($wpConfig.closest('[contenteditable]').attr('contenteditable')); }
		var getRenderContainer = _wp.getRenderContainer = function() { var $parent = $wpConfig.closest('[webpartid]').parent(), $container = $parent.find('.sp365-wp-container'); if($container.length == 0) { $container = $('<div>').addClass('sp365-wp-container').addClass('container-fluid'); $parent.append($container); } return $container; }
		var destroyRenderContainer = _wp.destroyRenderContainer = function() { var $parent = $wpConfig.closest('[webpartid]').parent(), $container = $parent.find('.sp365-wp-container'); $container.detach(); };
		var init = _wp.init = function() {
			var promise = newPromise(function(resolve, reject) {
				requireJQuery().then(function(jQuery) {
					$ = jQuery;
					// 
					var wpConfig = getConfig();
					if (wpConfig) {
						logVerbose('- loaded custom webpart from \''+ $wpConfig +'\' with config \''+ wpConfig +'\'.');
						if (!wpConfig.id) { var $wpId = $wpConfig.attr('id')||$wpConfig.closest('[webpartid]'), wpId = (($wpId.length == 1 && $wpId.find('sp365-wp').length == 1) ? 'wp_'+$wpId.attr('webpartid') : ''); if (!wpId) { wpId = 'wp_'+newElementId(); } wpConfig.id = wpId; setConfig(wpConfig); }
						$wpConfig.attr('id', wpConfig.id);
						includeStyle('hideWp_'+wpConfig.id, '#'+wpConfig.id+'{display:none}');
						// 
						if (wpConfig.type) {
							var customWebPartTypesMeta = [
								{regex:/^LinkedInConnector$/gi,scriptId:'sp365.linkedin',scriptSrc:baseScriptFolderPath+'sp365.linkedin.min.js?'+scriptVersion,createNew:function(){return new WebParts.LinkedInConnectorWebPart(_wp, $wpConfig);}},
								{regex:/^SmartTiles$/gi,scriptId:'sp365.tiles',scriptSrc:baseScriptFolderPath+'sp365.tiles.min.js?'+scriptVersion,createNew:function(){return new WebParts.SmartTilesWebPart(_wp, $wpConfig);}},
							];
							var meta = customWebPartTypesMeta.filter(function(meta){return (meta && meta.regex && meta.regex.test(wpConfig.type));})[0];
							if (meta) {
								try {
									if (typeof(meta.createNew) != 'function') { throw 'createNew is not a function.'; }
									require(meta.scriptId, meta.scriptSrc, true).then(function() {
										_childWp = meta.createNew();
										//$wpConfig.find('.sp365-wp-description').hide();
										_childWp.init().then(resolve, reject);
									}, reject);
								}
								catch(ex) { reject('- error creating new instance of custom webpart from \''+ $wpConfig +'\'. Error: '+ex.message); }
							}
							else { reject('- error loading custom webpart from \''+ $wpConfig +'\' because \'type\' was not recognised.'); }
						}
						else { reject('- error loading custom webpart from \''+ $wpConfig +'\' because it did not define a \'type\'.'); }
					}
					else { reject('- error loading custom webpart from \''+ $wpConfig +'\' because config was empty.'); }
				}, reject);
			});
			return promise;
		}
		var destroy = _wp.destroy = function() { return newResolvedPromise(_wp); }
	});
	var initCustomWebParts = function() {
		requireJQuery().then(function($) {
			logVerbose('- loaded \'sp365.js\' and dependencies.');
			// 
			var $customWebParts = []; $('[sp365-wp]').each(function() { var $wp = new WebParts.BaseWebPart($(this)); $customWebParts.push($wp); });
			allPromise($customWebParts.map(function($wp){ return $wp.init(); }), {alwaysResolveQ:true}).then(function(result) {
				var $customWebPartsInited = (result||[]);
				logVerbose('- inited \''+ $customWebPartsInited.length +'\' webparts.');
			});
		}, function(error) { logError('- Could not initialise the SP365 Add-Ins. Error: '+ error); });
	}
	// 
	var init = function() {
		logVerbose('- loading \'sp365.js\'.'); 
		// 
		requireJQuery().then(function($) {
			logVerbose('- loaded \'sp365.js\' and dependencies.');
			// 
			initCustomWebParts();
		}, function(error) { logError('- Could not initialise the SP365 Add-Ins. Error: '+ error); });
	}
	// 
	try { init(); }
	catch(ex) { logError('Unexpected error initializing \'sp365.js\'.'); }
})(window.SP365=(window.SP365||{}));
