/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _dominate = __webpack_require__(1);

	var _main = __webpack_require__(3);

	_dominate.dominate.setHTML(_main.main, document.body);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.dominate = exports.store = undefined;

	var _dominator = __webpack_require__(2);

	var store = new _dominator.Store();

	var dominate = new _dominator.Dominator(store);

	exports.store = store;
	exports.dominate = dominate;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var events = {
	    'onclick': 'click',
	    'onchange': 'change',
	    'onsubmit': 'submit',
	    'onkeyup': 'keyup',
	    'oninput': 'input'
	};

	function router(routes) {
	    var url = location.hash.slice(1) || '/';
	    var callback = routes[url];
	    callback();
	}

	function createNode(node) {
	    var text = arguments.length <= 1 || arguments[1] === undefined ? void 0 : arguments[1];
	    var options = arguments.length <= 2 || arguments[2] === undefined ? void 0 : arguments[2];

	    var n = {};
	    n.node = node;
	    if (!!text) {
	        n.text = text;
	    }
	    if (!!options) {
	        n.options = options;
	    }
	    return n;
	}

	function mergeNodes(parent, child) {
	    var node = parent;
	    node.children ? node.children.push(child) : node.children = [child];
	    return node;
	}

	function addManyChildren(parent, children) {
	    var node = parent;
	    var length = children.length;
	    for (var x = 0; x < length; x++) {
	        node.children ? node.children.push(children[x]) : node.children = [children[x]];
	    }
	    return node;
	}

	function createManyNodes(node, childrenArr) {
	    var newArr = [];
	    var length = childrenArr.length;
	    for (var x = 0; x < length; x++) {
	        newArr.push(createNode(node, childrenArr[x][0], childrenArr[x][1] ? childrenArr[x][1] : void 0));
	    }
	    return newArr;
	}

	function registerStoreCallbacks(store, func, callbackStore) {
	    if (callbackStore.has(store)) {
	        var callbacks = callbackStore.get(store);
	        if (callbacks.has('custom_callbacks')) {
	            var customCallbacks = callbacks.get('custom_callbacks');
	            customCallbacks.push(func);
	            callbacks.set('custom_callbacks', customCallbacks);
	        } else {
	            var customCallbacks = [func];
	            callbacks.set('custom_callbacks', customCallbacks);
	        }
	    } else {
	        var newCallbacks = new Map();
	        newCallbacks.set('custom_callbacks', [func]);
	        callbackStore.set(store, newCallbacks);
	    };
	}

	function callMountFuncs(funcs) {
	    var _this = this,
	        _arguments = arguments;

	    funcs.forEach(function (item) {
	        item.call(_this, _arguments);
	    });
	}

	function addCallbackEvents(callbackMap) {
	    callbackMap.forEach(function (event, id) {
	        for (var x in event) {
	            var node = document.getElementById(id);
	            if (!!node) {
	                node.addEventListener(x, event[x]);
	            }
	        }
	    });
	}

	function replaceTextWithStore(text, func) {
	    var update = arguments.length <= 2 || arguments[2] === undefined ? void 0 : arguments[2];
	    var subscribeArr = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

	    var subscribe = subscribeArr;
	    var regMatch = /{{(.*?)}}/;
	    if (!update) {
	        if (!text.match(regMatch)) {
	            return { subscribe: subscribe, text: text };
	        }
	        var store = regMatch.exec(text)[1];
	        if (!func.getStore(store)) {
	            throw 'store not found: ' + store;
	        }
	        subscribe.push(store);
	        var newText = text.replace(regMatch, func.getStore(store));
	        return replaceTextWithStore(newText, func, void 0, subscribe);
	    } else {
	        if (!text.match(regMatch)) {
	            return text;
	        }
	        var store = regMatch.exec(text)[1];
	        var newText = text.replace(regMatch, func.getStore(store));
	        return replaceTextWithStore(newText, func, true);
	    }
	}

	function addComponentHTML(elements, storeGrab, node) {
	    var length = elements.length;
	    for (var x = 0; x < length; x++) {
	        node.appendChild(createHyperText(elements[x], storeGrab));
	    }
	}

	function createHyperText(obj, storeFunc) {
	    var regMatch = /{{(.*?)}}/;
	    var node = document.createElement(obj.node);
	    // for purposes of updating, every element needs an id, so we ensure that
	    // it does
	    var id = !obj.options ? Math.random() : !obj.options.id ? Math.random() : obj.options.id;
	    var text = obj.text || '';
	    var callbacks = storeFunc.storeSet();
	    var eventCallbacks = storeFunc.eventCallbacks;
	    if (!!text) {
	        var oldText = text;
	        if (!!regMatch.test(text)) {
	            var textObject = replaceTextWithStore(text, storeFunc);
	            text = textObject.text;
	            var subscription = textObject.subscribe;
	            for (var x = 0; x < subscription.length; x++) {
	                if (callbacks.has(subscription[x])) {
	                    var storeMap = callbacks.get(subscription[x]);
	                    if (storeMap.has(id)) {
	                        var newObj = storeMap.get(id);
	                        newObj.textContent = oldText;
	                        storeMap.set(id, newObj);
	                        callbacks.set(subscription[x], storeMap);
	                    } else {
	                        var newMap = new Map();
	                        newMap.set(id, { textContent: oldText });
	                        callbacks.set(subscription[x], newMap);
	                    }
	                } else {
	                    var newCallbacksMap = new Map();
	                    newCallbacksMap.set(id, { textContent: oldText });
	                    callbacks.set(subscription[x], newCallbacksMap);
	                }
	            }
	        }
	    }
	    node.textContent = text;
	    // build string from options object
	    if (!obj.options) {
	        node.id = id;
	    }
	    if (!!obj.options) {
	        if (!obj.options.id) {
	            node.id = id;
	        }
	        for (var _x5 in obj.options) {
	            if (!!events[_x5]) {
	                if (eventCallbacks.has(id)) {
	                    var callbacksObj = eventCallbacks.get(id);
	                    callbacksObj[events[_x5]] = obj.options[_x5];
	                    continue;
	                } else {
	                    var callbacksObj = {};
	                    callbacksObj[events[_x5]] = obj.options[_x5];
	                    eventCallbacks.set(id, callbacksObj);
	                    continue;
	                }
	            }
	            var attribute = undefined;
	            if (_x5 === 'class') {
	                attribute = 'className';
	            } else {
	                attribute = _x5;
	            }
	            if (regMatch.test(obj.options[_x5])) {
	                // save the non-converted text, then run through replaceStore
	                var oldText = obj.options[_x5];
	                var attObject = replaceTextWithStore(obj.options[_x5], storeFunc);
	                var subscription = attObject.subscribe;
	                for (var y = 0; y < subscription.length; y++) {
	                    if (callbacks.has(subscription[y])) {
	                        var storeMap = callbacks.get(subscription[y]);
	                        if (storeMap.has(id)) {
	                            var newObj = storeMap.get(id);
	                            newObj[attribute] = oldText;
	                            storeMap.set(id, newObj);
	                            callbacks.set(subscription[y], storeMap);
	                        } else {
	                            var newMap = new Map();
	                            var newObj = {};
	                            newObj[attribute] = oldText;
	                            newMap.set(id, newObj);
	                            callbacks.set(subscription[y], newMap);
	                        }
	                    } else {
	                        var newCallbacksMap = new Map();
	                        var newAttObj = {};
	                        newAttObj[attribute] = oldText;
	                        newCallbacksMap.set(id, newAttObj);
	                        callbacks.set(subscription[y], newCallbacksMap);
	                    }
	                }
	                node[attribute] = attObject.text;
	            } else {
	                node[attribute] = obj.options[_x5];
	            }
	        }
	    }
	    if (!!obj.children) {
	        // traverse tree and wrap all nested child arrays between tags
	        for (var n = 0; n < obj.children.length; n++) {
	            node.appendChild(createHyperText(obj.children[n], storeFunc));
	        }
	        return node;
	    }
	    return node;
	}

	var Router = (function () {
	    function Router() {
	        _classCallCheck(this, Router);

	        this.routes = {};
	    }

	    _createClass(Router, [{
	        key: 'addRoute',
	        value: function addRoute(path, callback) {
	            this.routes[path] = callback;
	        }
	    }, {
	        key: 'run',
	        value: function run() {
	            var that = this;
	            window.onhashchange = function () {
	                router(that.routes);
	            };
	            window.addEventListener('load', function () {
	                router(that.routes);
	            });
	        }
	    }]);

	    return Router;
	})();

	var Store = (function () {
	    function Store() {
	        _classCallCheck(this, Store);

	        this.store = new Map();
	        this.storeCallbacks = new Map();
	    }

	    _createClass(Store, [{
	        key: 'setStore',
	        value: function setStore(name, value) {
	            var that = this;
	            this.store.set(name, value);
	            if (this.storeCallbacks.has(name)) {
	                var callbacks = this.storeCallbacks.get(name);
	                callbacks.forEach(function (obj, id) {
	                    var _this2 = this,
	                        _arguments2 = arguments;

	                    if (id === 'custom_callbacks') {
	                        obj.forEach(function (item) {
	                            return item.call(_this2, _arguments2);
	                        });
	                    } else {
	                        for (var x in obj) {
	                            var newText = replaceTextWithStore(obj[x], that, true);
	                            var node = document.getElementById(id);
	                            if (!!node) {
	                                if (x === 'textContent') {
	                                    node.textContent = newText;
	                                } else {
	                                    node[x] = newText;
	                                    //node.setAttribute(x, newText);
	                                }
	                            }
	                        }
	                    }
	                });
	            }
	        }
	    }, {
	        key: 'getStore',
	        value: function getStore(name) {
	            return this.store.get(name);
	        }
	    }, {
	        key: 'getSubscription',
	        value: function getSubscription() {
	            var that = this;
	            return function (name) {
	                return that.getStore(name);
	            };
	        }
	    }, {
	        key: 'callbackLogger',
	        value: function callbackLogger() {
	            var that = this;
	            return function () {
	                return that.storeCallbacks;
	            };
	        }
	    }, {
	        key: 'registerCallback',
	        value: function registerCallback(store, func) {
	            var that = this;
	            registerStoreCallbacks(store, func, that.storeCallbacks);
	        }
	    }, {
	        key: 'subscribe',
	        value: function subscribe(storename) {
	            return '{{' + storename + '}}';
	        }
	    }]);

	    return Store;
	})();

	var Dominator = (function () {
	    function Dominator(store) {
	        _classCallCheck(this, Dominator);

	        var that = this;
	        this.eventCallbacks = new Map();
	        this.storeGrab = {
	            getStore: !store ? null : store.getSubscription(),
	            storeSet: !store ? null : store.callbackLogger(),
	            eventCallbacks: that.eventCallbacks
	        };
	        this.unmounted = [];
	    }

	    _createClass(Dominator, [{
	        key: 'create',
	        value: function create(node) {
	            var text = arguments.length <= 1 || arguments[1] === undefined ? void 0 : arguments[1];
	            var options = arguments.length <= 2 || arguments[2] === undefined ? void 0 : arguments[2];

	            return createNode(node, text, options);
	        }
	    }, {
	        key: 'createMany',
	        value: function createMany(node, childrenArr) {
	            return createManyNodes(node, childrenArr);
	        }
	    }, {
	        key: 'addChildren',
	        value: function addChildren(parent, children) {
	            return addManyChildren(parent, children);
	        }
	    }, {
	        key: 'addChild',
	        value: function addChild(parent, child) {
	            return mergeNodes(parent, child);
	        }
	    }, {
	        key: 'setHTML',
	        value: function setHTML(elements, node) {
	            var _this3 = this;

	            var mounted = arguments.length <= 2 || arguments[2] === undefined ? void 0 : arguments[2];
	            var unmounted = arguments.length <= 3 || arguments[3] === undefined ? void 0 : arguments[3];

	            if (unmounted) {
	                (function () {
	                    _this3.mounted = function () {
	                        callMountFuncs(unmounted);
	                        window.removeEventListener('unload', _this3.mounted);
	                    };
	                    window.addEventListener('unload', _this3.mounted);
	                })();
	            }
	            node.innerHTML = '';
	            addComponentHTML(elements, this.storeGrab, node);
	            addCallbackEvents(this.eventCallbacks);
	            if (mounted) {
	                (function () {
	                    _this3.mounted = function () {
	                        callMountFuncs(mounted);
	                        window.removeEventListener('onload', _this3.mounted);
	                    };
	                    window.addEventListener('onload', _this3.mounted);
	                })();
	                callMountFuncs(mounted);
	            }
	        }
	    }]);

	    return Dominator;
	})();

	exports.Store = Store;
	exports.Dominator = Dominator;
	exports.Router = Router;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.main = undefined;

	var _dominate = __webpack_require__(1);

	var main = [_dominate.dominate.create('h1', 'Hello World!')];

	exports.main = main;

/***/ }
/******/ ]);