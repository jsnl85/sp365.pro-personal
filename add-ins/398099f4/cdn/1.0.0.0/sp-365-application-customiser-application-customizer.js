define("bff4db75-2ec7-49ee-84ea-f9698da91d06_0.0.1", ["@microsoft/decorators","@microsoft/sp-core-library","@microsoft/sp-application-base","Sp365ApplicationCustomiserApplicationCustomizerStrings"], function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var decorators_1 = __webpack_require__(1);
var sp_core_library_1 = __webpack_require__(2);
var sp_application_base_1 = __webpack_require__(3);
var strings = __webpack_require__(4);
var LOG_SOURCE = 'Sp365ApplicationCustomiserApplicationCustomizer';
var SCRIPT_SRC = 'https://sp365.pro/add-ins/', SCRIPT_PATH = '/cdn/js/sp365.min.js';
/** A Custom Action which can be run during execution of a Client Side Application */
var Sp365ApplicationCustomiserApplicationCustomizer = (function (_super) {
    __extends(Sp365ApplicationCustomiserApplicationCustomizer, _super);
    function Sp365ApplicationCustomiserApplicationCustomizer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Sp365ApplicationCustomiserApplicationCustomizer.prototype.onInit = function () {
        sp_core_library_1.Log.info(LOG_SOURCE, "onInit(): Initialized " + strings.Title);
        // load sp365.pro JS sript assynchronously...
        var uniqueId = this.properties.uniqueId || 'cdcb95cd';
        var version = this.properties.version || '1.0.0.0';
        var scriptSrc = "" + SCRIPT_SRC + SCRIPT_SRC + uniqueId + "/" + version + SCRIPT_PATH;
        var scriptTag = document.createElement("script");
        scriptTag.type = "text/javascript";
        scriptTag.src = scriptSrc;
        document.getElementsByTagName("head")[0].appendChild(scriptTag);
        sp_core_library_1.Log.info(LOG_SOURCE, "onInit(): Added script link.");
        return Promise.resolve();
    };
    __decorate([
        decorators_1.override
    ], Sp365ApplicationCustomiserApplicationCustomizer.prototype, "onInit", null);
    return Sp365ApplicationCustomiserApplicationCustomizer;
}(sp_application_base_1.BaseApplicationCustomizer));
exports.default = Sp365ApplicationCustomiserApplicationCustomizer;



/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ })
/******/ ])});;
//# sourceMappingURL=sp-365-application-customiser-application-customizer.js.map