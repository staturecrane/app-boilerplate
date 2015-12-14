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

	var _main = __webpack_require__(4);

	var _template = __webpack_require__(6);

	var crossroads = __webpack_require__(8);
	var hasher = __webpack_require__(10);

	__webpack_require__(12);
	__webpack_require__(16);

	//import {main, mainMounted} from './components/main.js';

	var DEFAULT_HASH = '';

	/*crossroads.addRoute('', ()=>{
	    dominate.setHTML(main, document.getElementById('main'), mainMounted);
	});*/

	crossroads.addRoute('', function () {
	    _dominate.dominate.setHTML(_main.main, document.body, _main.mainMounted, _main.mainUnmounted);
	});

	crossroads.addRoute('admin', function () {
	    _dominate.dominate.setHTML(_template.template, document.body, _template.templateMounted, _template.templateUnmounted);
	});

	function parseHash(newHash, oldHash) {
	    crossroads.parse(newHash);
	}

	hasher.initialized.add(parseHash);

	hasher.changed.add(parseHash);

	hasher.init();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.dominate = undefined;

	var _dominator = __webpack_require__(2);

	var _store = __webpack_require__(3);

	var dominate = new _dominator.Dominator(_store.store);

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
	                        window.addRemoveEventListener('onload', _this3.mounted);
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
	exports.store = undefined;

	var _dominator = __webpack_require__(2);

	var store = new _dominator.Store();

	exports.store = store;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.mainUnmounted = exports.mainMounted = exports.main = undefined;

	var _dominate = __webpack_require__(1);

	var _store = __webpack_require__(3);

	var API = __webpack_require__(5);

	//compatibility ftw
	//requestAnimationFrame saves us the trouble of calling setTimeout or setInterval,
	//but also releaves us of the ability to control framerate, so if you're going
	//for that filmic 24fps, use setInterval(callback, 1000/24)

	window.requestAnimFrame = (function () {
	  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
	    window.setTimeout(callback, 1000 / 60);
	  };
	})();

	var main = [_dominate.dominate.create('div', void 0, {
	  id: 'main'
	}), _dominate.dominate.create('div', void 0, {
	  id: 'sidebar-background'
	}), _dominate.dominate.create('div', void 0, {
	  id: 'sidebar'
	}), _dominate.dominate.create('div', void 0, {
	  id: 'logo'
	})];

	var mainMounted = [createGoldenCSS, function () {
	  return window.addEventListener('resize', createGoldenCSS);
	}, function () {
	  API.getArticleList(function (data) {
	    _store.store.setStore('articleList', data);
	  });
	}];

	var mainUnmounted = [function () {
	  return window.removeEventListener('resize', createGoldenCSS);
	}];

	exports.main = main;
	exports.mainMounted = mainMounted;
	exports.mainUnmounted = mainUnmounted;

	//the width and the position of the main elements of the page
	//are calculated based on the current browser width and the golden ratio

	//for extra fun, we position the elements to form a golden rectangle

	//this css is completely responsive, without the need for media queries and
	//break points

	function createGoldenCSS() {
	  var width = window.innerWidth;
	  var height = window.innerHeight;
	  var goldenWidth = width / 1.62;
	  var goldenHeight = height / 1.62;

	  var mainPromise = new Promise(function (resolve, reject) {
	    if (document.getElementById('main')) {
	      resolve();
	    }
	  });
	  mainPromise.then(function () {
	    if (width > 600) {
	      if (document.getElementById('logo-svg')) {
	        document.body.removeChild(document.getElementById('logo-svg'));
	        document.body.removeChild(document.getElementById('orbit-svg'));
	      }
	      var _main = document.getElementById('main');
	      _main.style.width = goldenWidth + 'px';
	      _main.style.height = height + 'px';
	      _main.style.top = 0;
	      _main.style.left = width - goldenWidth + 'px';

	      var sidebar = document.getElementById('sidebar');
	      sidebar.style.width = width - goldenWidth + 'px';
	      sidebar.style.top = height - goldenHeight + 'px';
	      sidebar.style.left = 0;
	      sidebar.style.height = goldenHeight + 'px';

	      var sidebarBack = document.getElementById('sidebar-background');
	      sidebarBack.style.width = width - goldenWidth + 'px';
	      sidebarBack.style.top = height - goldenHeight + 'px';
	      sidebarBack.style.left = 0;
	      sidebarBack.style.height = goldenHeight + 'px';

	      var logo = document.getElementById('logo');
	      logo.style.top = 0;
	      logo.style.left = 0;
	      logo.style.width = width - goldenWidth + 'px';
	      var logoheight = height - goldenHeight;
	      logo.style.height = logoheight + 'px';

	      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	      svg.id = 'logo-svg';
	      svg.style.top = 0;
	      svg.style.left = 0;
	      svg.setAttribute('height', logoheight);
	      svg.setAttribute('width', width - goldenWidth);
	      document.body.appendChild(svg);

	      var orbitSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	      orbitSVG.id = 'orbit-svg';
	      orbitSVG.style.top = 0;
	      orbitSVG.style.left = 0;
	      orbitSVG.setAttribute('height', logoheight);
	      orbitSVG.setAttribute('width', width - goldenWidth);
	      document.body.appendChild(orbitSVG);

	      animateSomethingHorizontally(width - goldenWidth, logoheight);
	    } else {
	      if (document.getElementById('logo-svg')) {
	        document.body.removeChild(document.getElementById('logo-svg'));
	        document.body.removeChild(document.getElementById('orbit-svg'));
	      }
	      var _main2 = document.getElementById('main');
	      _main2.style.width = width + 'px';
	      _main2.style.height = goldenHeight + 'px';
	      _main2.style.top = height - goldenHeight + 'px';
	      _main2.style.left = 0;

	      var sidebar = document.getElementById('sidebar');
	      sidebar.style.width = goldenWidth + 'px';
	      sidebar.style.top = 0;
	      sidebar.style.height = height - goldenHeight + 'px';

	      var sidebarBack = document.getElementById('sidebar-background');
	      sidebarBack.style.width = goldenWidth + 'px';
	      sidebarBack.style.top = 0;
	      sidebarBack.style.height = height - goldenHeight + 'px';

	      var logo = document.getElementById('logo');
	      logo.style.top = 0;
	      logo.style.left = goldenWidth + 'px';
	      logo.style.width = width - goldenWidth + 'px';
	      var logoheight = height - goldenHeight;
	      logo.style.height = logoheight + 'px';

	      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	      svg.id = 'logo-svg';
	      svg.style.top = 0;
	      svg.style.left = goldenWidth + 'px';
	      svg.setAttribute('height', logoheight);
	      svg.setAttribute('width', width - goldenWidth);
	      document.body.appendChild(svg);

	      var orbitSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	      orbitSVG.id = 'orbit-svg';
	      orbitSVG.style.top = 0;
	      orbitSVG.style.left = goldenWidth + 'px';
	      orbitSVG.setAttribute('height', logoheight);
	      orbitSVG.setAttribute('width', width - goldenWidth);
	      document.body.appendChild(orbitSVG);

	      animateSomethingVertically(width - goldenWidth, logoheight);
	    }
	  });
	}

	function animateSomethingHorizontally(logoWidth, logoHeight) {
	  var name = "richard herbert   ";
	  var nameLength = name.length;

	  var randomNumbers = [];

	  var startTimes = [];

	  for (var r = 0; r < nameLength; r++) {
	    randomNumbers.push(Math.random());
	    startTimes.push(void 0);
	  }

	  window.requestAnimationFrame(draw);

	  function draw(timestamp) {
	    //window.requestAnimationFrame(draw)
	    var svg = document.getElementById('logo-svg');
	    var width = logoWidth;
	    var height = logoHeight;
	    var offset50 = width / 45;
	    var offset20 = width / 19;
	    var offset500 = width / 500;
	    svg.innerHTML = '';
	    var centerX = width / 8;
	    var centerY = height / 2;

	    var _loop = function _loop(z) {
	      if (startTimes[z] === void 0) {
	        startTimes[z] = timestamp;
	      }
	      var progress = (timestamp - startTimes[z]) / 10 * randomNumbers[z] / 1000;(function (letter, distance) {
	        if (z === 8) {
	          progress = 0;
	        }
	        var x = distance * offset20 * Math.cos(progress * (Math.PI * 2));
	        var y = distance * offset20 * Math.sin(progress * (Math.PI * 2)); //
	        var path = document.createElementNS("http://www.w3.org/2000/svg", "text");

	        if (!document.getElementById(letter + z + '-orbitSVG')) {
	          var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	          circle.setAttribute('cx', centerX + 'px');
	          circle.setAttribute('cy', centerY + 'px');
	          circle.setAttribute('r', distance * offset20);
	          circle.setAttribute('fill', 'none');
	          circle.setAttribute('stroke', '#2A2C2B');
	          circle.setAttribute('stroke-width', 1);
	          circle.id = letter + z + '-orbitSVG';
	          svg.appendChild(circle);
	        }

	        var pathCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	        pathCircle.setAttribute('cx', centerX + x + 'px');
	        pathCircle.setAttribute('cy', centerY + y + 'px');
	        pathCircle.setAttribute('r', offset50);

	        if (letter === " ") {} else if (z === 0 || z === 8) {
	          pathCircle.setAttribute('fill', '#374140');
	          pathCircle.setAttribute('stroke', null);
	          svg.appendChild(pathCircle);
	        } else {
	          pathCircle.setAttribute('fill', 'none');
	          pathCircle.setAttribute('stroke', '#2A2C2B');
	          pathCircle.setAttribute('stroke-width', 1);
	          svg.appendChild(pathCircle);
	        }

	        path.id = 'nameLetter-' + letter;
	        path.textContent = letter;
	        path.setAttribute('font-size', width / 500 + 'em');
	        path.setAttribute('x', centerX + offset500 / 2 + x + 'px');
	        path.setAttribute('y', centerY + offset500 * 5.8 + y + 'px');
	        path.setAttribute('text-anchor', 'middle');
	        if (z === 0 || z === 8) {
	          path.setAttribute('fill', '#1E1E20');
	        } else {
	          path.setAttribute('fill', '#DC3522');
	        }
	        svg.appendChild(path);
	        if (progress > 1) startTimes[z] = void 0;
	      })(name[z], z);
	    };

	    for (var z = 0; z < nameLength; z++) {
	      _loop(z);
	    }
	  }
	}

	function animateSomethingVertically(logoWidth, logoHeight) {
	  var name = "richard herbert   ";
	  var nameLength = name.length;

	  var randomNumbers = [];

	  var startTimes = [];

	  for (var r = 0; r < nameLength; r++) {
	    randomNumbers.push(Math.random());
	    startTimes.push(void 0);
	  }

	  window.requestAnimationFrame(draw);

	  function draw(timestamp) {
	    //window.requestAnimationFrame(draw)
	    var svg = document.getElementById('logo-svg');
	    var width = logoWidth;
	    var height = logoHeight;
	    var offset50 = height / 40;
	    var offset20 = height / 17;
	    var offset500 = height / 500;
	    svg.innerHTML = '';
	    var centerX = width / 2;
	    var centerY = height / 10;

	    var _loop2 = function _loop2(z) {
	      if (startTimes[z] === void 0) {
	        startTimes[z] = timestamp;
	      }
	      var progress = (timestamp - startTimes[z]) / 10 * randomNumbers[z] / 1000;(function (letter, distance) {
	        if (z === 8) {
	          progress = 0;
	        }
	        var x = distance * offset20 * Math.sin(progress * (Math.PI * 2));
	        var y = distance * offset20 * Math.cos(progress * (Math.PI * 2));
	        var path = document.createElementNS("http://www.w3.org/2000/svg", "text");

	        if (!document.getElementById(letter + z + '-orbitSVG')) {
	          var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	          circle.setAttribute('cx', centerX + 'px');
	          circle.setAttribute('cy', centerY + 'px');
	          circle.setAttribute('r', distance * offset20);
	          circle.setAttribute('fill', 'none');
	          circle.setAttribute('stroke', '#2A2C2B');
	          circle.setAttribute('stroke-width', 1);
	          circle.id = letter + z + '-orbitSVG';
	          svg.appendChild(circle);
	        }

	        var pathCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	        pathCircle.setAttribute('cx', centerX + x + 'px');
	        pathCircle.setAttribute('cy', centerY + y + 'px');
	        pathCircle.setAttribute('r', offset50);

	        if (letter === " ") {} else if (z === 0 || z === 8) {
	          pathCircle.setAttribute('fill', '#374140');
	          pathCircle.setAttribute('stroke', null);
	          svg.appendChild(pathCircle);
	        } else {
	          pathCircle.setAttribute('fill', 'none');
	          pathCircle.setAttribute('stroke', '#2A2C2B');
	          pathCircle.setAttribute('stroke-width', 1);
	          svg.appendChild(pathCircle);
	        }

	        path.id = 'nameLetter-' + letter;
	        path.textContent = letter;
	        path.setAttribute('font-size', height / 380 + 'em');
	        path.setAttribute('x', centerX + offset500 / 2 + x + 'px');
	        path.setAttribute('y', centerY + offset500 * 5.8 + y + 'px');
	        path.setAttribute('text-anchor', 'middle');
	        if (z === 0 || z === 8) {
	          path.setAttribute('fill', '#1E1E20');
	        } else {
	          path.setAttribute('fill', '#DC3522');
	        }
	        svg.appendChild(path);
	        if (progress > 1) startTimes[z] = void 0;
	      })(name[z], z);
	    };

	    for (var z = 0; z < nameLength; z++) {
	      _loop2(z);
	    }
	  }
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	var socket = io.connect('162.242.230.237:80');

	module.exports = {
	    sendArticle: function sendArticle(data) {
	        socket.emit('newArticle', data);
	    },
	    getArticleList: function getArticleList(callback) {
	        socket.emit('getArticleList', callback);
	    }
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.templateUnmounted = exports.templateMounted = exports.template = undefined;

	var _dominate = __webpack_require__(1);

	var _store = __webpack_require__(3);

	var showdown = __webpack_require__(7);

	var API = __webpack_require__(5);

	_store.store.setStore('padValue', '#WriteSomeMarkdown');
	_store.store.setStore('titleInput', 'Title');
	_store.store.setStore('imageInput', 'Image Url');

	var templateMounted = [addCSS, function () {
	    return window.addEventListener('resize', addCSS);
	}, function () {
	    API.getArticleList(function (data) {
	        _store.store.setStore('articleList', data);
	        addTemplateList(_store.store.getStore('articleList'));
	    });
	}, convertToMarkdown];

	var templateUnmounted = [function () {
	    return window.removeEventListener('resize', addCSS);
	}];

	var inputs = _dominate.dominate.createMany('input', [[void 0, {
	    id: 'title-input',
	    type: 'text',
	    value: '{{titleInput}}',
	    placeholder: 'title',
	    oninput: function oninput(e) {
	        _store.store.setStore('titleInput', e.target.value);
	    }
	}], [void 0, {
	    id: 'image-input',
	    type: 'text',
	    value: '{{imageInput}}',
	    placeholder: 'imageUrl',
	    oninput: function oninput(e) {
	        _store.store.setStore('imageInput', e.target.value);
	    }
	}]]);

	var template = [_dominate.dominate.addChildren(_dominate.dominate.create('form', void 0, {
	    id: 'input-form' }), inputs), _dominate.dominate.addChild(_dominate.dominate.create('div', void 0, {
	    id: 'pad' }), _dominate.dominate.create('textarea', void 0, {
	    id: 'text-area',
	    value: '{{padValue}}',
	    oninput: function oninput(e) {
	        _store.store.setStore('padValue', e.target.value);
	    }
	})), _dominate.dominate.create('div', void 0, {
	    id: 'preview' }), _dominate.dominate.create('div', void 0, {
	    id: 'template-list-container' }), _dominate.dominate.addChildren(_dominate.dominate.create('div', void 0, {
	    id: 'save-and-delete'
	}), [_dominate.dominate.create('button', 'Save', {
	    id: 'submit-button',
	    onclick: function onclick() {
	        var title = document.getElementById('title-input');
	        var img = document.getElementById('image-input');
	        var textArea = document.getElementById('text-area');
	        var article = {
	            title: _store.store.getStore('titleInput'),
	            img: _store.store.getStore('imageInput'),
	            content: _store.store.getStore('padValue')
	        };
	        //API.sendArticle(article);
	    }
	}), _dominate.dominate.create('button', 'Delete')])];

	exports.template = template;
	exports.templateMounted = templateMounted;
	exports.templateUnmounted = templateUnmounted;

	function addCSS() {
	    var height = window.innerHeight;
	    var width = window.innerWidth;
	    var inputForm = document.getElementById('input-form');
	    var textInput = document.getElementById('title-input');
	    var imageInput = document.getElementById('image-input');
	    var pad = document.getElementById('pad');
	    var preview = document.getElementById('preview');
	    var templateList = document.getElementById('template-list-container');
	    var saveAndDelete = document.getElementById('save-and-delete');

	    templateList.style.top = 0;
	    templateList.style.left = 0;
	    templateList.style.width = (width - width / 1.62) / 1.62 + 'px';
	    templateList.style.height = height - height / 1.62 + 'px';

	    preview.style.top = 0;
	    preview.style.height = height - 20 + 'px';
	    preview.style.left = width - width / 1.62 + width / 200 + 'px';
	    preview.style.width = width / 1.62 + 'px';

	    saveAndDelete.style.top = height - 20 + 'px';
	    saveAndDelete.style.left = width - width / 1.62 + 'px';
	    saveAndDelete.style.width = width / 1.62 + 'px';
	    saveAndDelete.style.height = '20px';

	    pad.style.top = height - height / 1.62 + 'px';
	    pad.style.left = 0;
	    pad.style.width = width - width / 1.62 + 'px';
	    pad.style.height = height / 1.62 + 'px';

	    inputForm.style.top = 0;
	    inputForm.style.left = 0;
	    inputForm.style.width = width - width / 1.62 + 'px';
	    inputForm.style.height = height - height / 1.62 + 'px';

	    textInput.style.top = 0;
	    textInput.style.height = (height - height / 1.62) / 1.62 + 'px';
	    textInput.style.left = (width - width / 1.62) / 1.62 + 'px';
	    textInput.style.width = width - width / 1.62 - (width - width / 1.62) / 1.62 + 'px';

	    imageInput.style.top = (height - height / 1.62) / 1.62 + 'px';
	    imageInput.style.left = (width - width / 1.62) / 1.62 + 'px';
	    imageInput.style.height = height - height / 1.62 - (height - height / 1.62) / 1.62 + 'px';
	    imageInput.style.width = width - width / 1.62 - (width - width / 1.62) / 1.62 + 'px';
	}

	function convertToMarkdown() {
	    var converter = new showdown.Converter();
	    var pad = document.getElementById('text-area');
	    var markdownArea = document.getElementById('preview');

	    var convertTextAreaToMarkdown = function convertTextAreaToMarkdown() {
	        var markdownText = pad.value;
	        var html = converter.makeHtml(markdownText);
	        markdownArea.innerHTML = html;
	    };

	    pad.addEventListener('input', convertTextAreaToMarkdown);

	    convertTextAreaToMarkdown();
	}

	function addTemplateList(data) {
	    var list = [];
	    data.forEach(function (item) {
	        list.push(_dominate.dominate.addChildren(_dominate.dominate.create('div', void 0, {
	            class: 'template-div',
	            onclick: function onclick() {
	                console.log('onclick');
	                console.log(item);
	                _store.store.setStore('titleInput', item.title), _store.store.setStore('imageInput', item.img), _store.store.setStore('padValue', item.content);
	            }
	        }), [_dominate.dominate.create('h3', item.title), _dominate.dominate.create('h7', item.created_at)]));
	    });

	    _dominate.dominate.setHTML(list, document.getElementById('template-list-container'));
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	; /*! showdown 19-10-2015 */
	(function () {
	  /**
	   * Created by Tivie on 13-07-2015.
	   */

	  function getDefaultOpts(simple) {
	    'use strict';

	    var defaultOptions = {
	      omitExtraWLInCodeBlocks: {
	        default: false,
	        describe: 'Omit the default extra whiteline added to code blocks',
	        type: 'boolean'
	      },
	      noHeaderId: {
	        default: false,
	        describe: 'Turn on/off generated header id',
	        type: 'boolean'
	      },
	      prefixHeaderId: {
	        default: false,
	        describe: 'Specify a prefix to generated header ids',
	        type: 'string'
	      },
	      headerLevelStart: {
	        default: false,
	        describe: 'The header blocks level start',
	        type: 'integer'
	      },
	      parseImgDimensions: {
	        default: false,
	        describe: 'Turn on/off image dimension parsing',
	        type: 'boolean'
	      },
	      simplifiedAutoLink: {
	        default: false,
	        describe: 'Turn on/off GFM autolink style',
	        type: 'boolean'
	      },
	      literalMidWordUnderscores: {
	        default: false,
	        describe: 'Parse midword underscores as literal underscores',
	        type: 'boolean'
	      },
	      strikethrough: {
	        default: false,
	        describe: 'Turn on/off strikethrough support',
	        type: 'boolean'
	      },
	      tables: {
	        default: false,
	        describe: 'Turn on/off tables support',
	        type: 'boolean'
	      },
	      tablesHeaderId: {
	        default: false,
	        describe: 'Add an id to table headers',
	        type: 'boolean'
	      },
	      ghCodeBlocks: {
	        default: true,
	        describe: 'Turn on/off GFM fenced code blocks support',
	        type: 'boolean'
	      },
	      tasklists: {
	        default: false,
	        describe: 'Turn on/off GFM tasklist support',
	        type: 'boolean'
	      },
	      smoothLivePreview: {
	        default: false,
	        describe: 'Prevents weird effects in live previews due to incomplete input',
	        type: 'boolean'
	      }
	    };
	    if (simple === false) {
	      return JSON.parse(JSON.stringify(defaultOptions));
	    }
	    var ret = {};
	    for (var opt in defaultOptions) {
	      if (defaultOptions.hasOwnProperty(opt)) {
	        ret[opt] = defaultOptions[opt].default;
	      }
	    }
	    return ret;
	  }

	  /**
	   * Created by Tivie on 06-01-2015.
	   */

	  // Private properties
	  var showdown = {},
	      parsers = {},
	      extensions = {},
	      globalOptions = getDefaultOpts(true),
	      flavor = {
	    github: {
	      omitExtraWLInCodeBlocks: true,
	      prefixHeaderId: 'user-content-',
	      simplifiedAutoLink: true,
	      literalMidWordUnderscores: true,
	      strikethrough: true,
	      tables: true,
	      tablesHeaderId: true,
	      ghCodeBlocks: true,
	      tasklists: true
	    },
	    vanilla: getDefaultOpts(true)
	  };

	  /**
	   * helper namespace
	   * @type {{}}
	   */
	  showdown.helper = {};

	  /**
	   * TODO LEGACY SUPPORT CODE
	   * @type {{}}
	   */
	  showdown.extensions = {};

	  /**
	   * Set a global option
	   * @static
	   * @param {string} key
	   * @param {*} value
	   * @returns {showdown}
	   */
	  showdown.setOption = function (key, value) {
	    'use strict';

	    globalOptions[key] = value;
	    return this;
	  };

	  /**
	   * Get a global option
	   * @static
	   * @param {string} key
	   * @returns {*}
	   */
	  showdown.getOption = function (key) {
	    'use strict';

	    return globalOptions[key];
	  };

	  /**
	   * Get the global options
	   * @static
	   * @returns {{}}
	   */
	  showdown.getOptions = function () {
	    'use strict';

	    return globalOptions;
	  };

	  /**
	   * Reset global options to the default values
	   * @static
	   */
	  showdown.resetOptions = function () {
	    'use strict';

	    globalOptions = getDefaultOpts(true);
	  };

	  /**
	   * Set the flavor showdown should use as default
	   * @param {string} name
	   */
	  showdown.setFlavor = function (name) {
	    'use strict';

	    if (flavor.hasOwnProperty(name)) {
	      var preset = flavor[name];
	      for (var option in preset) {
	        if (preset.hasOwnProperty(option)) {
	          globalOptions[option] = preset[option];
	        }
	      }
	    }
	  };

	  /**
	   * Get the default options
	   * @static
	   * @param {boolean} [simple=true]
	   * @returns {{}}
	   */
	  showdown.getDefaultOptions = function (simple) {
	    'use strict';

	    return getDefaultOpts(simple);
	  };

	  /**
	   * Get or set a subParser
	   *
	   * subParser(name)       - Get a registered subParser
	   * subParser(name, func) - Register a subParser
	   * @static
	   * @param {string} name
	   * @param {function} [func]
	   * @returns {*}
	   */
	  showdown.subParser = function (name, func) {
	    'use strict';

	    if (showdown.helper.isString(name)) {
	      if (typeof func !== 'undefined') {
	        parsers[name] = func;
	      } else {
	        if (parsers.hasOwnProperty(name)) {
	          return parsers[name];
	        } else {
	          throw Error('SubParser named ' + name + ' not registered!');
	        }
	      }
	    }
	  };

	  /**
	   * Gets or registers an extension
	   * @static
	   * @param {string} name
	   * @param {object|function=} ext
	   * @returns {*}
	   */
	  showdown.extension = function (name, ext) {
	    'use strict';

	    if (!showdown.helper.isString(name)) {
	      throw Error('Extension \'name\' must be a string');
	    }

	    name = showdown.helper.stdExtName(name);

	    // Getter
	    if (showdown.helper.isUndefined(ext)) {
	      if (!extensions.hasOwnProperty(name)) {
	        throw Error('Extension named ' + name + ' is not registered!');
	      }
	      return extensions[name];

	      // Setter
	    } else {
	        // Expand extension if it's wrapped in a function
	        if (typeof ext === 'function') {
	          ext = ext();
	        }

	        // Ensure extension is an array
	        if (!showdown.helper.isArray(ext)) {
	          ext = [ext];
	        }

	        var validExtension = validate(ext, name);

	        if (validExtension.valid) {
	          extensions[name] = ext;
	        } else {
	          throw Error(validExtension.error);
	        }
	      }
	  };

	  /**
	   * Gets all extensions registered
	   * @returns {{}}
	   */
	  showdown.getAllExtensions = function () {
	    'use strict';

	    return extensions;
	  };

	  /**
	   * Remove an extension
	   * @param {string} name
	   */
	  showdown.removeExtension = function (name) {
	    'use strict';

	    delete extensions[name];
	  };

	  /**
	   * Removes all extensions
	   */
	  showdown.resetExtensions = function () {
	    'use strict';

	    extensions = {};
	  };

	  /**
	   * Validate extension
	   * @param {array} extension
	   * @param {string} name
	   * @returns {{valid: boolean, error: string}}
	   */
	  function validate(extension, name) {
	    'use strict';

	    var errMsg = name ? 'Error in ' + name + ' extension->' : 'Error in unnamed extension',
	        ret = {
	      valid: true,
	      error: ''
	    };

	    if (!showdown.helper.isArray(extension)) {
	      extension = [extension];
	    }

	    for (var i = 0; i < extension.length; ++i) {
	      var baseMsg = errMsg + ' sub-extension ' + i + ': ',
	          ext = extension[i];
	      if ((typeof ext === 'undefined' ? 'undefined' : _typeof(ext)) !== 'object') {
	        ret.valid = false;
	        ret.error = baseMsg + 'must be an object, but ' + (typeof ext === 'undefined' ? 'undefined' : _typeof(ext)) + ' given';
	        return ret;
	      }

	      if (!showdown.helper.isString(ext.type)) {
	        ret.valid = false;
	        ret.error = baseMsg + 'property "type" must be a string, but ' + _typeof(ext.type) + ' given';
	        return ret;
	      }

	      var type = ext.type = ext.type.toLowerCase();

	      // normalize extension type
	      if (type === 'language') {
	        type = ext.type = 'lang';
	      }

	      if (type === 'html') {
	        type = ext.type = 'output';
	      }

	      if (type !== 'lang' && type !== 'output' && type !== 'listener') {
	        ret.valid = false;
	        ret.error = baseMsg + 'type ' + type + ' is not recognized. Valid values: "lang/language", "output/html" or "listener"';
	        return ret;
	      }

	      if (type === 'listener') {
	        if (showdown.helper.isUndefined(ext.listeners)) {
	          ret.valid = false;
	          ret.error = baseMsg + '. Extensions of type "listener" must have a property called "listeners"';
	          return ret;
	        }
	      } else {
	        if (showdown.helper.isUndefined(ext.filter) && showdown.helper.isUndefined(ext.regex)) {
	          ret.valid = false;
	          ret.error = baseMsg + type + ' extensions must define either a "regex" property or a "filter" method';
	          return ret;
	        }
	      }

	      if (ext.listeners) {
	        if (_typeof(ext.listeners) !== 'object') {
	          ret.valid = false;
	          ret.error = baseMsg + '"listeners" property must be an object but ' + _typeof(ext.listeners) + ' given';
	          return ret;
	        }
	        for (var ln in ext.listeners) {
	          if (ext.listeners.hasOwnProperty(ln)) {
	            if (typeof ext.listeners[ln] !== 'function') {
	              ret.valid = false;
	              ret.error = baseMsg + '"listeners" property must be an hash of [event name]: [callback]. listeners.' + ln + ' must be a function but ' + _typeof(ext.listeners[ln]) + ' given';
	              return ret;
	            }
	          }
	        }
	      }

	      if (ext.filter) {
	        if (typeof ext.filter !== 'function') {
	          ret.valid = false;
	          ret.error = baseMsg + '"filter" must be a function, but ' + _typeof(ext.filter) + ' given';
	          return ret;
	        }
	      } else if (ext.regex) {
	        if (showdown.helper.isString(ext.regex)) {
	          ext.regex = new RegExp(ext.regex, 'g');
	        }
	        if (!ext.regex instanceof RegExp) {
	          ret.valid = false;
	          ret.error = baseMsg + '"regex" property must either be a string or a RegExp object, but ' + _typeof(ext.regex) + ' given';
	          return ret;
	        }
	        if (showdown.helper.isUndefined(ext.replace)) {
	          ret.valid = false;
	          ret.error = baseMsg + '"regex" extensions must implement a replace string or function';
	          return ret;
	        }
	      }
	    }
	    return ret;
	  }

	  /**
	   * Validate extension
	   * @param {object} ext
	   * @returns {boolean}
	   */
	  showdown.validateExtension = function (ext) {
	    'use strict';

	    var validateExtension = validate(ext, null);
	    if (!validateExtension.valid) {
	      console.warn(validateExtension.error);
	      return false;
	    }
	    return true;
	  };

	  /**
	   * showdownjs helper functions
	   */

	  if (!showdown.hasOwnProperty('helper')) {
	    showdown.helper = {};
	  }

	  /**
	   * Check if var is string
	   * @static
	   * @param {string} a
	   * @returns {boolean}
	   */
	  showdown.helper.isString = function isString(a) {
	    'use strict';

	    return typeof a === 'string' || a instanceof String;
	  };

	  /**
	   * ForEach helper function
	   * @static
	   * @param {*} obj
	   * @param {function} callback
	   */
	  showdown.helper.forEach = function forEach(obj, callback) {
	    'use strict';

	    if (typeof obj.forEach === 'function') {
	      obj.forEach(callback);
	    } else {
	      for (var i = 0; i < obj.length; i++) {
	        callback(obj[i], i, obj);
	      }
	    }
	  };

	  /**
	   * isArray helper function
	   * @static
	   * @param {*} a
	   * @returns {boolean}
	   */
	  showdown.helper.isArray = function isArray(a) {
	    'use strict';

	    return a.constructor === Array;
	  };

	  /**
	   * Check if value is undefined
	   * @static
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
	   */
	  showdown.helper.isUndefined = function isUndefined(value) {
	    'use strict';

	    return typeof value === 'undefined';
	  };

	  /**
	   * Standardidize extension name
	   * @static
	   * @param {string} s extension name
	   * @returns {string}
	   */
	  showdown.helper.stdExtName = function (s) {
	    'use strict';

	    return s.replace(/[_-]||\s/g, '').toLowerCase();
	  };

	  function escapeCharactersCallback(wholeMatch, m1) {
	    'use strict';

	    var charCodeToEscape = m1.charCodeAt(0);
	    return '~E' + charCodeToEscape + 'E';
	  }

	  /**
	   * Callback used to escape characters when passing through String.replace
	   * @static
	   * @param {string} wholeMatch
	   * @param {string} m1
	   * @returns {string}
	   */
	  showdown.helper.escapeCharactersCallback = escapeCharactersCallback;

	  /**
	   * Escape characters in a string
	   * @static
	   * @param {string} text
	   * @param {string} charsToEscape
	   * @param {boolean} afterBackslash
	   * @returns {XML|string|void|*}
	   */
	  showdown.helper.escapeCharacters = function escapeCharacters(text, charsToEscape, afterBackslash) {
	    'use strict'
	    // First we have to escape the escape characters so that
	    // we can build a character class out of them
	    ;
	    var regexString = '([' + charsToEscape.replace(/([\[\]\\])/g, '\\$1') + '])';

	    if (afterBackslash) {
	      regexString = '\\\\' + regexString;
	    }

	    var regex = new RegExp(regexString, 'g');
	    text = text.replace(regex, escapeCharactersCallback);

	    return text;
	  };

	  /**
	   * matchRecursiveRegExp
	   *
	   * (c) 2007 Steven Levithan <stevenlevithan.com>
	   * MIT License
	   *
	   * Accepts a string to search, a left and right format delimiter
	   * as regex patterns, and optional regex flags. Returns an array
	   * of matches, allowing nested instances of left/right delimiters.
	   * Use the "g" flag to return all matches, otherwise only the
	   * first is returned. Be careful to ensure that the left and
	   * right format delimiters produce mutually exclusive matches.
	   * Backreferences are not supported within the right delimiter
	   * due to how it is internally combined with the left delimiter.
	   * When matching strings whose format delimiters are unbalanced
	   * to the left or right, the output is intentionally as a
	   * conventional regex library with recursion support would
	   * produce, e.g. "<<x>" and "<x>>" both produce ["x"] when using
	   * "<" and ">" as the delimiters (both strings contain a single,
	   * balanced instance of "<x>").
	   *
	   * examples:
	   * matchRecursiveRegExp("test", "\\(", "\\)")
	   * returns: []
	   * matchRecursiveRegExp("<t<<e>><s>>t<>", "<", ">", "g")
	   * returns: ["t<<e>><s>", ""]
	   * matchRecursiveRegExp("<div id=\"x\">test</div>", "<div\\b[^>]*>", "</div>", "gi")
	   * returns: ["test"]
	   */
	  showdown.helper.matchRecursiveRegExp = function (str, left, right, flags) {
	    'use strict';

	    var f = flags || '',
	        g = f.indexOf('g') > -1,
	        x = new RegExp(left + '|' + right, f),
	        l = new RegExp(left, f.replace(/g/g, '')),
	        a = [],
	        t,
	        s,
	        m,
	        start,
	        end;

	    do {
	      t = 0;
	      while (m = x.exec(str)) {
	        if (l.test(m[0])) {
	          if (! t++) {
	            start = m[0];
	            s = x.lastIndex;
	          }
	        } else if (t) {
	          if (! --t) {
	            end = m[0];
	            var match = str.slice(s, m.index);
	            a.push([start + match + end, match]);
	            if (!g) {
	              return a;
	            }
	          }
	        }
	      }
	    } while (t && (x.lastIndex = s));

	    return a;
	  };

	  /**
	   * POLYFILLS
	   */
	  if (showdown.helper.isUndefined(console)) {
	    console = {
	      warn: function warn(msg) {
	        'use strict';

	        alert(msg);
	      },
	      log: function log(msg) {
	        'use strict';

	        alert(msg);
	      },
	      error: function error(msg) {
	        'use strict';

	        throw msg;
	      }
	    };
	  }

	  /**
	   * Created by Estevao on 31-05-2015.
	   */

	  /**
	   * Showdown Converter class
	   * @class
	   * @param {object} [converterOptions]
	   * @returns {Converter}
	   */
	  showdown.Converter = function (converterOptions) {
	    'use strict';

	    var
	    /**
	     * Options used by this converter
	     * @private
	     * @type {{}}
	     */
	    options = {},

	    /**
	     * Language extensions used by this converter
	     * @private
	     * @type {Array}
	     */
	    langExtensions = [],

	    /**
	     * Output modifiers extensions used by this converter
	     * @private
	     * @type {Array}
	     */
	    outputModifiers = [],

	    /**
	     * Event listeners
	     * @private
	     * @type {{}}
	     */
	    listeners = {};

	    _constructor();

	    /**
	     * Converter constructor
	     * @private
	     */
	    function _constructor() {
	      converterOptions = converterOptions || {};

	      for (var gOpt in globalOptions) {
	        if (globalOptions.hasOwnProperty(gOpt)) {
	          options[gOpt] = globalOptions[gOpt];
	        }
	      }

	      // Merge options
	      if ((typeof converterOptions === 'undefined' ? 'undefined' : _typeof(converterOptions)) === 'object') {
	        for (var opt in converterOptions) {
	          if (converterOptions.hasOwnProperty(opt)) {
	            options[opt] = converterOptions[opt];
	          }
	        }
	      } else {
	        throw Error('Converter expects the passed parameter to be an object, but ' + (typeof converterOptions === 'undefined' ? 'undefined' : _typeof(converterOptions)) + ' was passed instead.');
	      }

	      if (options.extensions) {
	        showdown.helper.forEach(options.extensions, _parseExtension);
	      }
	    }

	    /**
	     * Parse extension
	     * @param {*} ext
	     * @param {string} [name='']
	     * @private
	     */
	    function _parseExtension(ext, name) {

	      name = name || null;
	      // If it's a string, the extension was previously loaded
	      if (showdown.helper.isString(ext)) {
	        ext = showdown.helper.stdExtName(ext);
	        name = ext;

	        // LEGACY_SUPPORT CODE
	        if (showdown.extensions[ext]) {
	          console.warn('DEPRECATION WARNING: ' + ext + ' is an old extension that uses a deprecated loading method.' + 'Please inform the developer that the extension should be updated!');
	          legacyExtensionLoading(showdown.extensions[ext], ext);
	          return;
	          // END LEGACY SUPPORT CODE
	        } else if (!showdown.helper.isUndefined(extensions[ext])) {
	            ext = extensions[ext];
	          } else {
	            throw Error('Extension "' + ext + '" could not be loaded. It was either not found or is not a valid extension.');
	          }
	      }

	      if (typeof ext === 'function') {
	        ext = ext();
	      }

	      if (!showdown.helper.isArray(ext)) {
	        ext = [ext];
	      }

	      var validExt = validate(ext, name);
	      if (!validExt.valid) {
	        throw Error(validExt.error);
	      }

	      for (var i = 0; i < ext.length; ++i) {
	        switch (ext[i].type) {

	          case 'lang':
	            langExtensions.push(ext[i]);
	            break;

	          case 'output':
	            outputModifiers.push(ext[i]);
	            break;
	        }
	        if (ext[i].hasOwnProperty(listeners)) {
	          for (var ln in ext[i].listeners) {
	            if (ext[i].listeners.hasOwnProperty(ln)) {
	              listen(ln, ext[i].listeners[ln]);
	            }
	          }
	        }
	      }
	    }

	    /**
	     * LEGACY_SUPPORT
	     * @param {*} ext
	     * @param {string} name
	     */
	    function legacyExtensionLoading(ext, name) {
	      if (typeof ext === 'function') {
	        ext = ext(new showdown.Converter());
	      }
	      if (!showdown.helper.isArray(ext)) {
	        ext = [ext];
	      }
	      var valid = validate(ext, name);

	      if (!valid.valid) {
	        throw Error(valid.error);
	      }

	      for (var i = 0; i < ext.length; ++i) {
	        switch (ext[i].type) {
	          case 'lang':
	            langExtensions.push(ext[i]);
	            break;
	          case 'output':
	            outputModifiers.push(ext[i]);
	            break;
	          default:
	            // should never reach here
	            throw Error('Extension loader error: Type unrecognized!!!');
	        }
	      }
	    }

	    /**
	     * Listen to an event
	     * @param {string} name
	     * @param {function} callback
	     */
	    function listen(name, callback) {
	      if (!showdown.helper.isString(name)) {
	        throw Error('Invalid argument in converter.listen() method: name must be a string, but ' + (typeof name === 'undefined' ? 'undefined' : _typeof(name)) + ' given');
	      }

	      if (typeof callback !== 'function') {
	        throw Error('Invalid argument in converter.listen() method: callback must be a function, but ' + (typeof callback === 'undefined' ? 'undefined' : _typeof(callback)) + ' given');
	      }

	      if (!listeners.hasOwnProperty(name)) {
	        listeners[name] = [];
	      }
	      listeners[name].push(callback);
	    }

	    /**
	     * Dispatch an event
	     * @private
	     * @param {string} evtName Event name
	     * @param {string} text Text
	     * @param {{}} options Converter Options
	     * @returns {string}
	     */
	    this._dispatch = function dispatch(evtName, text, options) {
	      if (listeners.hasOwnProperty(evtName)) {
	        for (var ei = 0; ei < listeners[evtName].length; ++ei) {
	          var nText = listeners[evtName][ei](evtName, text, this, options);
	          if (nText && typeof nText !== 'undefined') {
	            text = nText;
	          }
	        }
	      }
	      return text;
	    };

	    /**
	     * Listen to an event
	     * @param {string} name
	     * @param {function} callback
	     * @returns {showdown.Converter}
	     */
	    this.listen = function (name, callback) {
	      listen(name, callback);
	      return this;
	    };

	    /**
	     * Converts a markdown string into HTML
	     * @param {string} text
	     * @returns {*}
	     */
	    this.makeHtml = function (text) {
	      //check if text is not falsy
	      if (!text) {
	        return text;
	      }

	      var globals = {
	        gHtmlBlocks: [],
	        gHtmlSpans: [],
	        gUrls: {},
	        gTitles: {},
	        gDimensions: {},
	        gListLevel: 0,
	        hashLinkCounts: {},
	        langExtensions: langExtensions,
	        outputModifiers: outputModifiers,
	        converter: this
	      };

	      // attacklab: Replace ~ with ~T
	      // This lets us use tilde as an escape char to avoid md5 hashes
	      // The choice of character is arbitrary; anything that isn't
	      // magic in Markdown will work.
	      text = text.replace(/~/g, '~T');

	      // attacklab: Replace $ with ~D
	      // RegExp interprets $ as a special character
	      // when it's in a replacement string
	      text = text.replace(/\$/g, '~D');

	      // Standardize line endings
	      text = text.replace(/\r\n/g, '\n'); // DOS to Unix
	      text = text.replace(/\r/g, '\n'); // Mac to Unix

	      // Make sure text begins and ends with a couple of newlines:
	      text = '\n\n' + text + '\n\n';

	      // detab
	      text = showdown.subParser('detab')(text, options, globals);

	      // stripBlankLines
	      text = showdown.subParser('stripBlankLines')(text, options, globals);

	      //run languageExtensions
	      showdown.helper.forEach(langExtensions, function (ext) {
	        text = showdown.subParser('runExtension')(ext, text, options, globals);
	      });

	      // run the sub parsers
	      text = showdown.subParser('githubCodeBlocks')(text, options, globals);
	      text = showdown.subParser('hashHTMLBlocks')(text, options, globals);
	      text = showdown.subParser('hashHTMLSpans')(text, options, globals);
	      text = showdown.subParser('stripLinkDefinitions')(text, options, globals);
	      text = showdown.subParser('blockGamut')(text, options, globals);
	      text = showdown.subParser('unhashHTMLSpans')(text, options, globals);
	      text = showdown.subParser('unescapeSpecialChars')(text, options, globals);

	      // attacklab: Restore dollar signs
	      text = text.replace(/~D/g, '$$');

	      // attacklab: Restore tildes
	      text = text.replace(/~T/g, '~');

	      // Run output modifiers
	      showdown.helper.forEach(outputModifiers, function (ext) {
	        text = showdown.subParser('runExtension')(ext, text, options, globals);
	      });

	      return text;
	    };

	    /**
	     * Set an option of this Converter instance
	     * @param {string} key
	     * @param {*} value
	     */
	    this.setOption = function (key, value) {
	      options[key] = value;
	    };

	    /**
	     * Get the option of this Converter instance
	     * @param {string} key
	     * @returns {*}
	     */
	    this.getOption = function (key) {
	      return options[key];
	    };

	    /**
	     * Get the options of this Converter instance
	     * @returns {{}}
	     */
	    this.getOptions = function () {
	      return options;
	    };

	    /**
	     * Add extension to THIS converter
	     * @param {{}} extension
	     * @param {string} [name=null]
	     */
	    this.addExtension = function (extension, name) {
	      name = name || null;
	      _parseExtension(extension, name);
	    };

	    /**
	     * Use a global registered extension with THIS converter
	     * @param {string} extensionName Name of the previously registered extension
	     */
	    this.useExtension = function (extensionName) {
	      _parseExtension(extensionName);
	    };

	    /**
	     * Set the flavor THIS converter should use
	     * @param {string} name
	     */
	    this.setFlavor = function (name) {
	      if (flavor.hasOwnProperty(name)) {
	        var preset = flavor[name];
	        for (var option in preset) {
	          if (preset.hasOwnProperty(option)) {
	            options[option] = preset[option];
	          }
	        }
	      }
	    };

	    /**
	     * Remove an extension from THIS converter.
	     * Note: This is a costly operation. It's better to initialize a new converter
	     * and specify the extensions you wish to use
	     * @param {Array} extension
	     */
	    this.removeExtension = function (extension) {
	      if (!showdown.helper.isArray(extension)) {
	        extension = [extension];
	      }
	      for (var a = 0; a < extension.length; ++a) {
	        var ext = extension[a];
	        for (var i = 0; i < langExtensions.length; ++i) {
	          if (langExtensions[i] === ext) {
	            langExtensions[i].splice(i, 1);
	          }
	        }
	        for (var ii = 0; ii < outputModifiers.length; ++i) {
	          if (outputModifiers[ii] === ext) {
	            outputModifiers[ii].splice(i, 1);
	          }
	        }
	      }
	    };

	    /**
	     * Get all extension of THIS converter
	     * @returns {{language: Array, output: Array}}
	     */
	    this.getAllExtensions = function () {
	      return {
	        language: langExtensions,
	        output: outputModifiers
	      };
	    };
	  };

	  /**
	   * Turn Markdown link shortcuts into XHTML <a> tags.
	   */
	  showdown.subParser('anchors', function (text, options, globals) {
	    'use strict';

	    text = globals.converter._dispatch('anchors.before', text, options);

	    var writeAnchorTag = function writeAnchorTag(wholeMatch, m1, m2, m3, m4, m5, m6, m7) {
	      if (showdown.helper.isUndefined(m7)) {
	        m7 = '';
	      }
	      wholeMatch = m1;
	      var linkText = m2,
	          linkId = m3.toLowerCase(),
	          url = m4,
	          title = m7;

	      if (!url) {
	        if (!linkId) {
	          // lower-case and turn embedded newlines into spaces
	          linkId = linkText.toLowerCase().replace(/ ?\n/g, ' ');
	        }
	        url = '#' + linkId;

	        if (!showdown.helper.isUndefined(globals.gUrls[linkId])) {
	          url = globals.gUrls[linkId];
	          if (!showdown.helper.isUndefined(globals.gTitles[linkId])) {
	            title = globals.gTitles[linkId];
	          }
	        } else {
	          if (wholeMatch.search(/\(\s*\)$/m) > -1) {
	            // Special case for explicit empty url
	            url = '';
	          } else {
	            return wholeMatch;
	          }
	        }
	      }

	      url = showdown.helper.escapeCharacters(url, '*_', false);
	      var result = '<a href="' + url + '"';

	      if (title !== '' && title !== null) {
	        title = title.replace(/"/g, '&quot;');
	        title = showdown.helper.escapeCharacters(title, '*_', false);
	        result += ' title="' + title + '"';
	      }

	      result += '>' + linkText + '</a>';

	      return result;
	    };

	    // First, handle reference-style links: [link text] [id]
	    /*
	     text = text.replace(/
	     (							// wrap whole match in $1
	     \[
	     (
	     (?:
	     \[[^\]]*\]		// allow brackets nested one level
	     |
	     [^\[]			// or anything else
	     )*
	     )
	     \]
	       [ ]?					// one optional space
	     (?:\n[ ]*)?				// one optional newline followed by spaces
	       \[
	     (.*?)					// id = $3
	     \]
	     )()()()()					// pad remaining backreferences
	     /g,_DoAnchors_callback);
	     */
	    text = text.replace(/(\[((?:\[[^\]]*]|[^\[\]])*)][ ]?(?:\n[ ]*)?\[(.*?)])()()()()/g, writeAnchorTag);

	    //
	    // Next, inline-style links: [link text](url "optional title")
	    //

	    /*
	     text = text.replace(/
	     (						// wrap whole match in $1
	     \[
	     (
	     (?:
	     \[[^\]]*\]	// allow brackets nested one level
	     |
	     [^\[\]]			// or anything else
	     )
	     )
	     \]
	     \(						// literal paren
	     [ \t]*
	     ()						// no id, so leave $3 empty
	     <?(.*?)>?				// href = $4
	     [ \t]*
	     (						// $5
	     (['"])				// quote char = $6
	     (.*?)				// Title = $7
	     \6					// matching quote
	     [ \t]*				// ignore any spaces/tabs between closing quote and )
	     )?						// title is optional
	     \)
	     )
	     /g,writeAnchorTag);
	     */
	    text = text.replace(/(\[((?:\[[^\]]*]|[^\[\]])*)]\([ \t]*()<?(.*?(?:\(.*?\).*?)?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g, writeAnchorTag);

	    //
	    // Last, handle reference-style shortcuts: [link text]
	    // These must come last in case you've also got [link test][1]
	    // or [link test](/foo)
	    //

	    /*
	     text = text.replace(/
	     (                // wrap whole match in $1
	     \[
	     ([^\[\]]+)       // link text = $2; can't contain '[' or ']'
	     \]
	     )()()()()()      // pad rest of backreferences
	     /g, writeAnchorTag);
	     */
	    text = text.replace(/(\[([^\[\]]+)])()()()()()/g, writeAnchorTag);

	    text = globals.converter._dispatch('anchors.after', text, options);
	    return text;
	  });

	  showdown.subParser('autoLinks', function (text, options, globals) {
	    'use strict';

	    text = globals.converter._dispatch('autoLinks.before', text, options);

	    var simpleURLRegex = /\b(((https?|ftp|dict):\/\/|www\.)[^'">\s]+\.[^'">\s]+)(?=\s|$)(?!["<>])/gi,
	        delimUrlRegex = /<(((https?|ftp|dict):\/\/|www\.)[^'">\s]+)>/gi,
	        simpleMailRegex = /(?:^|[ \n\t])([A-Za-z0-9!#$%&'*+-/=?^_`\{|}~\.]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)(?:$|[ \n\t])/gi,
	        delimMailRegex = /<(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi;

	    text = text.replace(delimUrlRegex, '<a href=\"$1\">$1</a>');
	    text = text.replace(delimMailRegex, replaceMail);
	    //simpleURLRegex  = /\b(((https?|ftp|dict):\/\/|www\.)[-.+~:?#@!$&'()*,;=[\]\w]+)\b/gi,
	    // Email addresses: <address@domain.foo>

	    if (options.simplifiedAutoLink) {
	      text = text.replace(simpleURLRegex, '<a href=\"$1\">$1</a>');
	      text = text.replace(simpleMailRegex, replaceMail);
	    }

	    function replaceMail(wholeMatch, m1) {
	      var unescapedStr = showdown.subParser('unescapeSpecialChars')(m1);
	      return showdown.subParser('encodeEmailAddress')(unescapedStr);
	    }

	    text = globals.converter._dispatch('autoLinks.after', text, options);

	    return text;
	  });

	  /**
	   * These are all the transformations that form block-level
	   * tags like paragraphs, headers, and list items.
	   */
	  showdown.subParser('blockGamut', function (text, options, globals) {
	    'use strict';

	    text = globals.converter._dispatch('blockGamut.before', text, options);

	    // we parse blockquotes first so that we can have headings and hrs
	    // inside blockquotes
	    text = showdown.subParser('blockQuotes')(text, options, globals);
	    text = showdown.subParser('headers')(text, options, globals);

	    // Do Horizontal Rules:
	    var key = showdown.subParser('hashBlock')('<hr />', options, globals);
	    text = text.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm, key);
	    text = text.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm, key);
	    text = text.replace(/^[ ]{0,2}([ ]?_[ ]?){3,}[ \t]*$/gm, key);

	    text = showdown.subParser('lists')(text, options, globals);
	    text = showdown.subParser('codeBlocks')(text, options, globals);
	    text = showdown.subParser('tables')(text, options, globals);

	    // We already ran _HashHTMLBlocks() before, in Markdown(), but that
	    // was to escape raw HTML in the original Markdown source. This time,
	    // we're escaping the markup we've just created, so that we don't wrap
	    // <p> tags around block-level tags.
	    text = showdown.subParser('hashHTMLBlocks')(text, options, globals);
	    text = showdown.subParser('paragraphs')(text, options, globals);

	    text = globals.converter._dispatch('blockGamut.after', text, options);

	    return text;
	  });

	  showdown.subParser('blockQuotes', function (text, options, globals) {
	    'use strict';

	    text = globals.converter._dispatch('blockQuotes.before', text, options);
	    /*
	     text = text.replace(/
	     (								// Wrap whole match in $1
	     (
	     ^[ \t]*>[ \t]?			// '>' at the start of a line
	     .+\n					// rest of the first line
	     (.+\n)*					// subsequent consecutive lines
	     \n*						// blanks
	     )+
	     )
	     /gm, function(){...});
	     */

	    text = text.replace(/((^[ \t]{0,3}>[ \t]?.+\n(.+\n)*\n*)+)/gm, function (wholeMatch, m1) {
	      var bq = m1;

	      // attacklab: hack around Konqueror 3.5.4 bug:
	      // "----------bug".replace(/^-/g,"") == "bug"
	      bq = bq.replace(/^[ \t]*>[ \t]?/gm, '~0'); // trim one level of quoting

	      // attacklab: clean up hack
	      bq = bq.replace(/~0/g, '');

	      bq = bq.replace(/^[ \t]+$/gm, ''); // trim whitespace-only lines
	      bq = showdown.subParser('githubCodeBlocks')(bq, options, globals);
	      bq = showdown.subParser('blockGamut')(bq, options, globals); // recurse

	      bq = bq.replace(/(^|\n)/g, '$1  ');
	      // These leading spaces screw with <pre> content, so we need to fix that:
	      bq = bq.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function (wholeMatch, m1) {
	        var pre = m1;
	        // attacklab: hack around Konqueror 3.5.4 bug:
	        pre = pre.replace(/^  /mg, '~0');
	        pre = pre.replace(/~0/g, '');
	        return pre;
	      });

	      return showdown.subParser('hashBlock')('<blockquote>\n' + bq + '\n</blockquote>', options, globals);
	    });

	    text = globals.converter._dispatch('blockQuotes.after', text, options);
	    return text;
	  });

	  /**
	   * Process Markdown `<pre><code>` blocks.
	   */
	  showdown.subParser('codeBlocks', function (text, options, globals) {
	    'use strict';

	    text = globals.converter._dispatch('codeBlocks.before', text, options);
	    /*
	     text = text.replace(text,
	     /(?:\n\n|^)
	     (								// $1 = the code block -- one or more lines, starting with a space/tab
	     (?:
	     (?:[ ]{4}|\t)			// Lines must start with a tab or a tab-width of spaces - attacklab: g_tab_width
	     .*\n+
	     )+
	     )
	     (\n*[ ]{0,3}[^ \t\n]|(?=~0))	// attacklab: g_tab_width
	     /g,function(){...});
	     */

	    // attacklab: sentinel workarounds for lack of \A and \Z, safari\khtml bug
	    text += '~0';

	    var pattern = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g;
	    text = text.replace(pattern, function (wholeMatch, m1, m2) {
	      var codeblock = m1,
	          nextChar = m2,
	          end = '\n';

	      codeblock = showdown.subParser('outdent')(codeblock);
	      codeblock = showdown.subParser('encodeCode')(codeblock);
	      codeblock = showdown.subParser('detab')(codeblock);
	      codeblock = codeblock.replace(/^\n+/g, ''); // trim leading newlines
	      codeblock = codeblock.replace(/\n+$/g, ''); // trim trailing newlines

	      if (options.omitExtraWLInCodeBlocks) {
	        end = '';
	      }

	      codeblock = '<pre><code>' + codeblock + end + '</code></pre>';

	      return showdown.subParser('hashBlock')(codeblock, options, globals) + nextChar;
	    });

	    // attacklab: strip sentinel
	    text = text.replace(/~0/, '');

	    text = globals.converter._dispatch('codeBlocks.after', text, options);
	    return text;
	  });

	  /**
	   *
	   *   *  Backtick quotes are used for <code></code> spans.
	   *
	   *   *  You can use multiple backticks as the delimiters if you want to
	   *     include literal backticks in the code span. So, this input:
	   *
	   *         Just type ``foo `bar` baz`` at the prompt.
	   *
	   *       Will translate to:
	   *
	   *         <p>Just type <code>foo `bar` baz</code> at the prompt.</p>
	   *
	   *    There's no arbitrary limit to the number of backticks you
	   *    can use as delimters. If you need three consecutive backticks
	   *    in your code, use four for delimiters, etc.
	   *
	   *  *  You can use spaces to get literal backticks at the edges:
	   *
	   *         ... type `` `bar` `` ...
	   *
	   *       Turns to:
	   *
	   *         ... type <code>`bar`</code> ...
	   */
	  showdown.subParser('codeSpans', function (text, options, globals) {
	    'use strict';

	    text = globals.converter._dispatch('codeSpans.before', text, options);

	    /*
	     text = text.replace(/
	     (^|[^\\])					// Character before opening ` can't be a backslash
	     (`+)						// $2 = Opening run of `
	     (							// $3 = The code block
	     [^\r]*?
	     [^`]					// attacklab: work around lack of lookbehind
	     )
	     \2							// Matching closer
	     (?!`)
	     /gm, function(){...});
	     */
	    text = text.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm, function (wholeMatch, m1, m2, m3) {
	      var c = m3;
	      c = c.replace(/^([ \t]*)/g, ''); // leading whitespace
	      c = c.replace(/[ \t]*$/g, ''); // trailing whitespace
	      c = showdown.subParser('encodeCode')(c);
	      return m1 + '<code>' + c + '</code>';
	    });

	    text = globals.converter._dispatch('codeSpans.after', text, options);
	    return text;
	  });

	  /**
	   * Convert all tabs to spaces
	   */
	  showdown.subParser('detab', function (text) {
	    'use strict'

	    // expand first n-1 tabs
	    ;
	    text = text.replace(/\t(?=\t)/g, '    '); // g_tab_width

	    // replace the nth with two sentinels
	    text = text.replace(/\t/g, '~A~B');

	    // use the sentinel to anchor our regex so it doesn't explode
	    text = text.replace(/~B(.+?)~A/g, function (wholeMatch, m1) {
	      var leadingText = m1,
	          numSpaces = 4 - leadingText.length % 4; // g_tab_width

	      // there *must* be a better way to do this:
	      for (var i = 0; i < numSpaces; i++) {
	        leadingText += ' ';
	      }

	      return leadingText;
	    });

	    // clean up sentinels
	    text = text.replace(/~A/g, '    '); // g_tab_width
	    text = text.replace(/~B/g, '');

	    return text;
	  });

	  /**
	   * Smart processing for ampersands and angle brackets that need to be encoded.
	   */
	  showdown.subParser('encodeAmpsAndAngles', function (text) {
	    'use strict'
	    // Ampersand-encoding based entirely on Nat Irons's Amputator MT plugin:
	    // http://bumppo.net/projects/amputator/
	    ;
	    text = text.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, '&amp;');

	    // Encode naked <'s
	    text = text.replace(/<(?![a-z\/?\$!])/gi, '&lt;');

	    return text;
	  });

	  /**
	   * Returns the string, with after processing the following backslash escape sequences.
	   *
	   * attacklab: The polite way to do this is with the new escapeCharacters() function:
	   *
	   *    text = escapeCharacters(text,"\\",true);
	   *    text = escapeCharacters(text,"`*_{}[]()>#+-.!",true);
	   *
	   * ...but we're sidestepping its use of the (slow) RegExp constructor
	   * as an optimization for Firefox.  This function gets called a LOT.
	   */
	  showdown.subParser('encodeBackslashEscapes', function (text) {
	    'use strict';

	    text = text.replace(/\\(\\)/g, showdown.helper.escapeCharactersCallback);
	    text = text.replace(/\\([`*_{}\[\]()>#+-.!])/g, showdown.helper.escapeCharactersCallback);
	    return text;
	  });

	  /**
	   * Encode/escape certain characters inside Markdown code runs.
	   * The point is that in code, these characters are literals,
	   * and lose their special Markdown meanings.
	   */
	  showdown.subParser('encodeCode', function (text) {
	    'use strict'

	    // Encode all ampersands; HTML entities are not
	    // entities within a Markdown code span.
	    ;
	    text = text.replace(/&/g, '&amp;');

	    // Do the angle bracket song and dance:
	    text = text.replace(/</g, '&lt;');
	    text = text.replace(/>/g, '&gt;');

	    // Now, escape characters that are magic in Markdown:
	    text = showdown.helper.escapeCharacters(text, '*_{}[]\\', false);

	    // jj the line above breaks this:
	    //---
	    //* Item
	    //   1. Subitem
	    //            special char: *
	    // ---

	    return text;
	  });

	  /**
	   *  Input: an email address, e.g. "foo@example.com"
	   *
	   *  Output: the email address as a mailto link, with each character
	   *    of the address encoded as either a decimal or hex entity, in
	   *    the hopes of foiling most address harvesting spam bots. E.g.:
	   *
	   *    <a href="&#x6D;&#97;&#105;&#108;&#x74;&#111;:&#102;&#111;&#111;&#64;&#101;
	   *       x&#x61;&#109;&#x70;&#108;&#x65;&#x2E;&#99;&#111;&#109;">&#102;&#111;&#111;
	   *       &#64;&#101;x&#x61;&#109;&#x70;&#108;&#x65;&#x2E;&#99;&#111;&#109;</a>
	   *
	   *  Based on a filter by Matthew Wickline, posted to the BBEdit-Talk
	   *  mailing list: <http://tinyurl.com/yu7ue>
	   *
	   */
	  showdown.subParser('encodeEmailAddress', function (addr) {
	    'use strict';

	    var encode = [function (ch) {
	      return '&#' + ch.charCodeAt(0) + ';';
	    }, function (ch) {
	      return '&#x' + ch.charCodeAt(0).toString(16) + ';';
	    }, function (ch) {
	      return ch;
	    }];

	    addr = 'mailto:' + addr;

	    addr = addr.replace(/./g, function (ch) {
	      if (ch === '@') {
	        // this *must* be encoded. I insist.
	        ch = encode[Math.floor(Math.random() * 2)](ch);
	      } else if (ch !== ':') {
	        // leave ':' alone (to spot mailto: later)
	        var r = Math.random();
	        // roughly 10% raw, 45% hex, 45% dec
	        ch = r > 0.9 ? encode[2](ch) : r > 0.45 ? encode[1](ch) : encode[0](ch);
	      }
	      return ch;
	    });

	    addr = '<a href="' + addr + '">' + addr + '</a>';
	    addr = addr.replace(/">.+:/g, '">'); // strip the mailto: from the visible part

	    return addr;
	  });

	  /**
	   * Within tags -- meaning between < and > -- encode [\ ` * _] so they
	   * don't conflict with their use in Markdown for code, italics and strong.
	   */
	  showdown.subParser('escapeSpecialCharsWithinTagAttributes', function (text) {
	    'use strict'

	    // Build a regex to find HTML tags and comments.  See Friedl's
	    // "Mastering Regular Expressions", 2nd Ed., pp. 200-201.
	    ;
	    var regex = /(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;

	    text = text.replace(regex, function (wholeMatch) {
	      var tag = wholeMatch.replace(/(.)<\/?code>(?=.)/g, '$1`');
	      tag = showdown.helper.escapeCharacters(tag, '\\`*_', false);
	      return tag;
	    });

	    return text;
	  });

	  /**
	   * Handle github codeblocks prior to running HashHTML so that
	   * HTML contained within the codeblock gets escaped properly
	   * Example:
	   * ```ruby
	   *     def hello_world(x)
	   *       puts "Hello, #{x}"
	   *     end
	   * ```
	   */
	  showdown.subParser('githubCodeBlocks', function (text, options, globals) {
	    'use strict'

	    // early exit if option is not enabled
	    ;
	    if (!options.ghCodeBlocks) {
	      return text;
	    }

	    text = globals.converter._dispatch('githubCodeBlocks.before', text, options);

	    text += '~0';

	    text = text.replace(/(?:^|\n)```(.*)\n([\s\S]*?)\n```/g, function (wholeMatch, language, codeblock) {
	      var end = options.omitExtraWLInCodeBlocks ? '' : '\n';

	      codeblock = showdown.subParser('encodeCode')(codeblock);
	      codeblock = showdown.subParser('detab')(codeblock);
	      codeblock = codeblock.replace(/^\n+/g, ''); // trim leading newlines
	      codeblock = codeblock.replace(/\n+$/g, ''); // trim trailing whitespace

	      codeblock = '<pre><code' + (language ? ' class="' + language + ' language-' + language + '"' : '') + '>' + codeblock + end + '</code></pre>';

	      return showdown.subParser('hashBlock')(codeblock, options, globals);
	    });

	    // attacklab: strip sentinel
	    text = text.replace(/~0/, '');

	    text = globals.converter._dispatch('githubCodeBlocks.after', text, options);

	    return text;
	  });

	  showdown.subParser('hashBlock', function (text, options, globals) {
	    'use strict';

	    text = text.replace(/(^\n+|\n+$)/g, '');
	    return '\n\n~K' + (globals.gHtmlBlocks.push(text) - 1) + 'K\n\n';
	  });

	  showdown.subParser('hashElement', function (text, options, globals) {
	    'use strict';

	    return function (wholeMatch, m1) {
	      var blockText = m1;

	      // Undo double lines
	      blockText = blockText.replace(/\n\n/g, '\n');
	      blockText = blockText.replace(/^\n/, '');

	      // strip trailing blank lines
	      blockText = blockText.replace(/\n+$/g, '');

	      // Replace the element text with a marker ("~KxK" where x is its key)
	      blockText = '\n\n~K' + (globals.gHtmlBlocks.push(blockText) - 1) + 'K\n\n';

	      return blockText;
	    };
	  });

	  showdown.subParser('hashHTMLBlocks', function (text, options, globals) {
	    'use strict'

	    // attacklab: Double up blank lines to reduce lookaround
	    ;
	    text = text.replace(/\n/g, '\n\n');

	    // Hashify HTML blocks:
	    // We only want to do this for block-level HTML tags, such as headers,
	    // lists, and tables. That's because we still want to wrap <p>s around
	    // "paragraphs" that are wrapped in non-block-level tags, such as anchors,
	    // phrase emphasis, and spans. The list of tags we're looking for is
	    // hard-coded:
	    //var block_tags_a =
	    // 'p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del|style|section|header|footer|nav|article|aside';
	    // var block_tags_b =
	    // 'p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|style|section|header|footer|nav|article|aside';

	    // First, look for nested blocks, e.g.:
	    //   <div>
	    //     <div>
	    //     tags for inner block must be indented.
	    //     </div>
	    //   </div>
	    //
	    // The outermost tags must start at the left margin for this to match, and
	    // the inner nested divs must be indented.
	    // We need to do this before the next, more liberal match, because the next
	    // match will start at the first `<div>` and stop at the first `</div>`.

	    // attacklab: This regex can be expensive when it fails.
	    /*
	     var text = text.replace(/
	     (						// save in $1
	     ^					// start of line  (with /m)
	     <($block_tags_a)	// start tag = $2
	     \b					// word break
	     // attacklab: hack around khtml/pcre bug...
	     [^\r]*?\n			// any number of lines, minimally matching
	     </\2>				// the matching end tag
	     [ \t]*				// trailing spaces/tabs
	     (?=\n+)				// followed by a newline
	     )						// attacklab: there are sentinel newlines at end of document
	     /gm,function(){...}};
	     */
	    text = text.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm, showdown.subParser('hashElement')(text, options, globals));

	    //
	    // Now match more liberally, simply from `\n<tag>` to `</tag>\n`
	    //

	    /*
	     var text = text.replace(/
	     (						// save in $1
	     ^					// start of line  (with /m)
	     <($block_tags_b)	// start tag = $2
	     \b					// word break
	     // attacklab: hack around khtml/pcre bug...
	     [^\r]*?				// any number of lines, minimally matching
	     </\2>				// the matching end tag
	     [ \t]*				// trailing spaces/tabs
	     (?=\n+)				// followed by a newline
	     )						// attacklab: there are sentinel newlines at end of document
	     /gm,function(){...}};
	     */
	    text = text.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|style|section|header|footer|nav|article|aside|address|audio|canvas|figure|hgroup|output|video)\b[^\r]*?<\/\2>[ \t]*(?=\n+)\n)/gm, showdown.subParser('hashElement')(text, options, globals));

	    // Special case just for <hr />. It was easier to make a special case than
	    // to make the other regex more complicated.

	    /*
	     text = text.replace(/
	     (						// save in $1
	     \n\n				// Starting after a blank line
	     [ ]{0,3}
	     (<(hr)				// start tag = $2
	     \b					// word break
	     ([^<>])*?			//
	     \/?>)				// the matching end tag
	     [ \t]*
	     (?=\n{2,})			// followed by a blank line
	     )
	     /g,showdown.subParser('hashElement')(text, options, globals));
	     */
	    text = text.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g, showdown.subParser('hashElement')(text, options, globals));

	    // Special case for standalone HTML comments:

	    /*
	     text = text.replace(/
	     (						// save in $1
	     \n\n				// Starting after a blank line
	     [ ]{0,3}			// attacklab: g_tab_width - 1
	     <!
	     (--[^\r]*?--\s*)+
	     >
	     [ \t]*
	     (?=\n{2,})			// followed by a blank line
	     )
	     /g,showdown.subParser('hashElement')(text, options, globals));
	     */
	    text = text.replace(/(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n{2,}))/g, showdown.subParser('hashElement')(text, options, globals));

	    // PHP and ASP-style processor instructions (<?...?> and <%...%>)

	    /*
	     text = text.replace(/
	     (?:
	     \n\n				// Starting after a blank line
	     )
	     (						// save in $1
	     [ ]{0,3}			// attacklab: g_tab_width - 1
	     (?:
	     <([?%])			// $2
	     [^\r]*?
	     \2>
	     )
	     [ \t]*
	     (?=\n{2,})			// followed by a blank line
	     )
	     /g,showdown.subParser('hashElement')(text, options, globals));
	     */
	    text = text.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g, showdown.subParser('hashElement')(text, options, globals));

	    // attacklab: Undo double lines (see comment at top of this function)
	    text = text.replace(/\n\n/g, '\n');
	    return text;
	  });

	  /**
	   * Hash span elements that should not be parsed as markdown
	   */
	  showdown.subParser('hashHTMLSpans', function (text, config, globals) {
	    'use strict';

	    var matches = showdown.helper.matchRecursiveRegExp(text, '<code\\b[^>]*>', '</code>', 'gi');

	    for (var i = 0; i < matches.length; ++i) {
	      text = text.replace(matches[i][0], '~L' + (globals.gHtmlSpans.push(matches[i][0]) - 1) + 'L');
	    }
	    return text;
	  });

	  /**
	   * Unhash HTML spans
	   */
	  showdown.subParser('unhashHTMLSpans', function (text, config, globals) {
	    'use strict';

	    for (var i = 0; i < globals.gHtmlSpans.length; ++i) {
	      text = text.replace('~L' + i + 'L', globals.gHtmlSpans[i]);
	    }

	    return text;
	  });

	  showdown.subParser('headers', function (text, options, globals) {
	    'use strict';

	    text = globals.converter._dispatch('headers.before', text, options);

	    var prefixHeader = options.prefixHeaderId,
	        headerLevelStart = isNaN(parseInt(options.headerLevelStart)) ? 1 : parseInt(options.headerLevelStart),

	    // Set text-style headers:
	    //	Header 1
	    //	========
	    //
	    //	Header 2
	    //	--------
	    //
	    setextRegexH1 = options.smoothLivePreview ? /^(.+)[ \t]*\n={2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n=+[ \t]*\n+/gm,
	        setextRegexH2 = options.smoothLivePreview ? /^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n-+[ \t]*\n+/gm;

	    text = text.replace(setextRegexH1, function (wholeMatch, m1) {

	      var spanGamut = showdown.subParser('spanGamut')(m1, options, globals),
	          hID = options.noHeaderId ? '' : ' id="' + headerId(m1) + '"',
	          hLevel = headerLevelStart,
	          hashBlock = '<h' + hLevel + hID + '>' + spanGamut + '</h' + hLevel + '>';
	      return showdown.subParser('hashBlock')(hashBlock, options, globals);
	    });

	    text = text.replace(setextRegexH2, function (matchFound, m1) {
	      var spanGamut = showdown.subParser('spanGamut')(m1, options, globals),
	          hID = options.noHeaderId ? '' : ' id="' + headerId(m1) + '"',
	          hLevel = headerLevelStart + 1,
	          hashBlock = '<h' + hLevel + hID + '>' + spanGamut + '</h' + hLevel + '>';
	      return showdown.subParser('hashBlock')(hashBlock, options, globals);
	    });

	    // atx-style headers:
	    //  # Header 1
	    //  ## Header 2
	    //  ## Header 2 with closing hashes ##
	    //  ...
	    //  ###### Header 6
	    //
	    text = text.replace(/^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm, function (wholeMatch, m1, m2) {
	      var span = showdown.subParser('spanGamut')(m2, options, globals),
	          hID = options.noHeaderId ? '' : ' id="' + headerId(m2) + '"',
	          hLevel = headerLevelStart - 1 + m1.length,
	          header = '<h' + hLevel + hID + '>' + span + '</h' + hLevel + '>';

	      return showdown.subParser('hashBlock')(header, options, globals);
	    });

	    function headerId(m) {
	      var title,
	          escapedId = m.replace(/[^\w]/g, '').toLowerCase();

	      if (globals.hashLinkCounts[escapedId]) {
	        title = escapedId + '-' + globals.hashLinkCounts[escapedId]++;
	      } else {
	        title = escapedId;
	        globals.hashLinkCounts[escapedId] = 1;
	      }

	      // Prefix id to prevent causing inadvertent pre-existing style matches.
	      if (prefixHeader === true) {
	        prefixHeader = 'section';
	      }

	      if (showdown.helper.isString(prefixHeader)) {
	        return prefixHeader + title;
	      }
	      return title;
	    }

	    text = globals.converter._dispatch('headers.after', text, options);
	    return text;
	  });

	  /**
	   * Turn Markdown image shortcuts into <img> tags.
	   */
	  showdown.subParser('images', function (text, options, globals) {
	    'use strict';

	    text = globals.converter._dispatch('images.before', text, options);

	    var inlineRegExp = /!\[(.*?)]\s?\([ \t]*()<?(\S+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(['"])(.*?)\6[ \t]*)?\)/g,
	        referenceRegExp = /!\[(.*?)][ ]?(?:\n[ ]*)?\[(.*?)]()()()()()/g;

	    function writeImageTag(wholeMatch, altText, linkId, url, width, height, m5, title) {

	      var gUrls = globals.gUrls,
	          gTitles = globals.gTitles,
	          gDims = globals.gDimensions;

	      linkId = linkId.toLowerCase();

	      if (!title) {
	        title = '';
	      }

	      if (url === '' || url === null) {
	        if (linkId === '' || linkId === null) {
	          // lower-case and turn embedded newlines into spaces
	          linkId = altText.toLowerCase().replace(/ ?\n/g, ' ');
	        }
	        url = '#' + linkId;

	        if (!showdown.helper.isUndefined(gUrls[linkId])) {
	          url = gUrls[linkId];
	          if (!showdown.helper.isUndefined(gTitles[linkId])) {
	            title = gTitles[linkId];
	          }
	          if (!showdown.helper.isUndefined(gDims[linkId])) {
	            width = gDims[linkId].width;
	            height = gDims[linkId].height;
	          }
	        } else {
	          return wholeMatch;
	        }
	      }

	      altText = altText.replace(/"/g, '&quot;');
	      altText = showdown.helper.escapeCharacters(altText, '*_', false);
	      url = showdown.helper.escapeCharacters(url, '*_', false);
	      var result = '<img src="' + url + '" alt="' + altText + '"';

	      if (title) {
	        title = title.replace(/"/g, '&quot;');
	        title = showdown.helper.escapeCharacters(title, '*_', false);
	        result += ' title="' + title + '"';
	      }

	      if (width && height) {
	        width = width === '*' ? 'auto' : width;
	        height = height === '*' ? 'auto' : height;

	        result += ' width="' + width + '"';
	        result += ' height="' + height + '"';
	      }

	      result += ' />';

	      return result;
	    }

	    // First, handle reference-style labeled images: ![alt text][id]
	    text = text.replace(referenceRegExp, writeImageTag);

	    // Next, handle inline images:  ![alt text](url =<width>x<height> "optional title")
	    text = text.replace(inlineRegExp, writeImageTag);

	    text = globals.converter._dispatch('images.after', text, options);
	    return text;
	  });

	  showdown.subParser('italicsAndBold', function (text, options, globals) {
	    'use strict';

	    text = globals.converter._dispatch('italicsAndBold.before', text, options);

	    if (options.literalMidWordUnderscores) {
	      //underscores
	      // Since we are consuming a \s character, we need to add it
	      text = text.replace(/(^|\s|>|\b)__(?=\S)([^]+?)__(?=\b|<|\s|$)/gm, '$1<strong>$2</strong>');
	      text = text.replace(/(^|\s|>|\b)_(?=\S)([^]+?)_(?=\b|<|\s|$)/gm, '$1<em>$2</em>');
	      //asterisks
	      text = text.replace(/(\*\*)(?=\S)([^\r]*?\S[*]*)\1/g, '<strong>$2</strong>');
	      text = text.replace(/(\*)(?=\S)([^\r]*?\S)\1/g, '<em>$2</em>');
	    } else {
	      // <strong> must go first:
	      text = text.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g, '<strong>$2</strong>');
	      text = text.replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g, '<em>$2</em>');
	    }

	    text = globals.converter._dispatch('italicsAndBold.after', text, options);
	    return text;
	  });

	  /**
	   * Form HTML ordered (numbered) and unordered (bulleted) lists.
	   */
	  showdown.subParser('lists', function (text, options, globals) {
	    'use strict';

	    text = globals.converter._dispatch('lists.before', text, options);
	    /**
	     * Process the contents of a single ordered or unordered list, splitting it
	     * into individual list items.
	     * @param {string} listStr
	     * @param {boolean} trimTrailing
	     * @returns {string}
	     */
	    function processListItems(listStr, trimTrailing) {
	      // The $g_list_level global keeps track of when we're inside a list.
	      // Each time we enter a list, we increment it; when we leave a list,
	      // we decrement. If it's zero, we're not in a list anymore.
	      //
	      // We do this because when we're not inside a list, we want to treat
	      // something like this:
	      //
	      //    I recommend upgrading to version
	      //    8. Oops, now this line is treated
	      //    as a sub-list.
	      //
	      // As a single paragraph, despite the fact that the second line starts
	      // with a digit-period-space sequence.
	      //
	      // Whereas when we're inside a list (or sub-list), that line will be
	      // treated as the start of a sub-list. What a kludge, huh? This is
	      // an aspect of Markdown's syntax that's hard to parse perfectly
	      // without resorting to mind-reading. Perhaps the solution is to
	      // change the syntax rules such that sub-lists must start with a
	      // starting cardinal number; e.g. "1." or "a.".
	      globals.gListLevel++;

	      // trim trailing blank lines:
	      listStr = listStr.replace(/\n{2,}$/, '\n');

	      // attacklab: add sentinel to emulate \z
	      listStr += '~0';

	      var rgx = /(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+((\[(x| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm,
	          isParagraphed = /\n[ \t]*\n(?!~0)/.test(listStr);

	      listStr = listStr.replace(rgx, function (wholeMatch, m1, m2, m3, m4, taskbtn, checked) {
	        checked = checked && checked.trim() !== '';
	        var item = showdown.subParser('outdent')(m4, options, globals),
	            bulletStyle = '';

	        // Support for github tasklists
	        if (taskbtn && options.tasklists) {
	          bulletStyle = ' class="task-list-item" style="list-style-type: none;"';
	          item = item.replace(/^[ \t]*\[(x| )?]/m, function () {
	            var otp = '<input type="checkbox" disabled style="margin: 0px 0.35em 0.25em -1.6em; vertical-align: middle;"';
	            if (checked) {
	              otp += ' checked';
	            }
	            otp += '>';
	            return otp;
	          });
	        }
	        // m1 - Leading line or
	        // Has a double return (multi paragraph) or
	        // Has sublist
	        if (m1 || item.search(/\n{2,}/) > -1) {
	          item = showdown.subParser('githubCodeBlocks')(item, options, globals);
	          item = showdown.subParser('blockGamut')(item, options, globals);
	        } else {
	          // Recursion for sub-lists:
	          item = showdown.subParser('lists')(item, options, globals);
	          item = item.replace(/\n$/, ''); // chomp(item)
	          if (isParagraphed) {
	            item = showdown.subParser('paragraphs')(item, options, globals);
	          } else {
	            item = showdown.subParser('spanGamut')(item, options, globals);
	          }
	        }
	        item = '\n<li' + bulletStyle + '>' + item + '</li>\n';
	        return item;
	      });

	      // attacklab: strip sentinel
	      listStr = listStr.replace(/~0/g, '');

	      globals.gListLevel--;

	      if (trimTrailing) {
	        listStr = listStr.replace(/\s+$/, '');
	      }

	      return listStr;
	    }

	    /**
	     * Check and parse consecutive lists (better fix for issue #142)
	     * @param {string} list
	     * @param {string} listType
	     * @param {boolean} trimTrailing
	     * @returns {string}
	     */
	    function parseConsecutiveLists(list, listType, trimTrailing) {
	      // check if we caught 2 or more consecutive lists by mistake
	      // we use the counterRgx, meaning if listType is UL we look for UL and vice versa
	      var counterRxg = listType === 'ul' ? /^ {0,2}\d+\.[ \t]/gm : /^ {0,2}[*+-][ \t]/gm,
	          subLists = [],
	          result = '';

	      if (list.search(counterRxg) !== -1) {
	        (function parseCL(txt) {
	          var pos = txt.search(counterRxg);
	          if (pos !== -1) {
	            // slice
	            result += '\n\n<' + listType + '>' + processListItems(txt.slice(0, pos), !!trimTrailing) + '</' + listType + '>\n\n';

	            // invert counterType and listType
	            listType = listType === 'ul' ? 'ol' : 'ul';
	            counterRxg = listType === 'ul' ? /^ {0,2}\d+\.[ \t]/gm : /^ {0,2}[*+-][ \t]/gm;

	            //recurse
	            parseCL(txt.slice(pos));
	          } else {
	            result += '\n\n<' + listType + '>' + processListItems(txt, !!trimTrailing) + '</' + listType + '>\n\n';
	          }
	        })(list);
	        for (var i = 0; i < subLists.length; ++i) {}
	      } else {
	        result = '\n\n<' + listType + '>' + processListItems(list, !!trimTrailing) + '</' + listType + '>\n\n';
	      }

	      return result;
	    }

	    // attacklab: add sentinel to hack around khtml/safari bug:
	    // http://bugs.webkit.org/show_bug.cgi?id=11231
	    text += '~0';

	    // Re-usable pattern to match any entire ul or ol list:
	    var wholeList = /^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;

	    if (globals.gListLevel) {
	      text = text.replace(wholeList, function (wholeMatch, list, m2) {
	        var listType = m2.search(/[*+-]/g) > -1 ? 'ul' : 'ol';
	        return parseConsecutiveLists(list, listType, true);
	      });
	    } else {
	      wholeList = /(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;
	      //wholeList = /(\n\n|^\n?)( {0,3}([*+-]|\d+\.)[ \t]+[\s\S]+?)(?=(~0)|(\n\n(?!\t| {2,}| {0,3}([*+-]|\d+\.)[ \t])))/g;
	      text = text.replace(wholeList, function (wholeMatch, m1, list, m3) {

	        var listType = m3.search(/[*+-]/g) > -1 ? 'ul' : 'ol';
	        return parseConsecutiveLists(list, listType);
	      });
	    }

	    // attacklab: strip sentinel
	    text = text.replace(/~0/, '');

	    text = globals.converter._dispatch('lists.after', text, options);
	    return text;
	  });

	  /**
	   * Remove one level of line-leading tabs or spaces
	   */
	  showdown.subParser('outdent', function (text) {
	    'use strict'

	    // attacklab: hack around Konqueror 3.5.4 bug:
	    // "----------bug".replace(/^-/g,"") == "bug"
	    ;
	    text = text.replace(/^(\t|[ ]{1,4})/gm, '~0'); // attacklab: g_tab_width

	    // attacklab: clean up hack
	    text = text.replace(/~0/g, '');

	    return text;
	  });

	  /**
	   *
	   */
	  showdown.subParser('paragraphs', function (text, options, globals) {
	    'use strict';

	    text = globals.converter._dispatch('paragraphs.before', text, options);
	    // Strip leading and trailing lines:
	    text = text.replace(/^\n+/g, '');
	    text = text.replace(/\n+$/g, '');

	    var grafs = text.split(/\n{2,}/g),
	        grafsOut = [],
	        end = grafs.length; // Wrap <p> tags

	    for (var i = 0; i < end; i++) {
	      var str = grafs[i];

	      // if this is an HTML marker, copy it
	      if (str.search(/~K(\d+)K/g) >= 0) {
	        grafsOut.push(str);
	      } else if (str.search(/\S/) >= 0) {
	        str = showdown.subParser('spanGamut')(str, options, globals);
	        str = str.replace(/^([ \t]*)/g, '<p>');
	        str += '</p>';
	        grafsOut.push(str);
	      }
	    }

	    /** Unhashify HTML blocks */
	    end = grafsOut.length;
	    for (i = 0; i < end; i++) {
	      // if this is a marker for an html block...
	      while (grafsOut[i].search(/~K(\d+)K/) >= 0) {
	        var blockText = globals.gHtmlBlocks[RegExp.$1];
	        blockText = blockText.replace(/\$/g, '$$$$'); // Escape any dollar signs
	        grafsOut[i] = grafsOut[i].replace(/~K\d+K/, blockText);
	      }
	    }

	    text = globals.converter._dispatch('paragraphs.after', text, options);
	    return grafsOut.join('\n\n');
	  });

	  /**
	   * Run extension
	   */
	  showdown.subParser('runExtension', function (ext, text, options, globals) {
	    'use strict';

	    if (ext.filter) {
	      text = ext.filter(text, globals.converter, options);
	    } else if (ext.regex) {
	      // TODO remove this when old extension loading mechanism is deprecated
	      var re = ext.regex;
	      if (!re instanceof RegExp) {
	        re = new RegExp(re, 'g');
	      }
	      text = text.replace(re, ext.replace);
	    }

	    return text;
	  });

	  /**
	   * These are all the transformations that occur *within* block-level
	   * tags like paragraphs, headers, and list items.
	   */
	  showdown.subParser('spanGamut', function (text, options, globals) {
	    'use strict';

	    text = globals.converter._dispatch('spanGamut.before', text, options);
	    text = showdown.subParser('codeSpans')(text, options, globals);
	    text = showdown.subParser('escapeSpecialCharsWithinTagAttributes')(text, options, globals);
	    text = showdown.subParser('encodeBackslashEscapes')(text, options, globals);

	    // Process anchor and image tags. Images must come first,
	    // because ![foo][f] looks like an anchor.
	    text = showdown.subParser('images')(text, options, globals);
	    text = showdown.subParser('anchors')(text, options, globals);

	    // Make links out of things like `<http://example.com/>`
	    // Must come after _DoAnchors(), because you can use < and >
	    // delimiters in inline links like [this](<url>).
	    text = showdown.subParser('autoLinks')(text, options, globals);
	    text = showdown.subParser('encodeAmpsAndAngles')(text, options, globals);
	    text = showdown.subParser('italicsAndBold')(text, options, globals);
	    text = showdown.subParser('strikethrough')(text, options, globals);

	    // Do hard breaks:
	    text = text.replace(/  +\n/g, ' <br />\n');

	    text = globals.converter._dispatch('spanGamut.after', text, options);
	    return text;
	  });

	  showdown.subParser('strikethrough', function (text, options, globals) {
	    'use strict';

	    if (options.strikethrough) {
	      text = globals.converter._dispatch('strikethrough.before', text, options);
	      text = text.replace(/(?:~T){2}([^~]+)(?:~T){2}/g, '<del>$1</del>');
	      text = globals.converter._dispatch('strikethrough.after', text, options);
	    }

	    return text;
	  });

	  /**
	   * Strip any lines consisting only of spaces and tabs.
	   * This makes subsequent regexs easier to write, because we can
	   * match consecutive blank lines with /\n+/ instead of something
	   * contorted like /[ \t]*\n+/
	   */
	  showdown.subParser('stripBlankLines', function (text) {
	    'use strict';

	    return text.replace(/^[ \t]+$/mg, '');
	  });

	  /**
	   * Strips link definitions from text, stores the URLs and titles in
	   * hash references.
	   * Link defs are in the form: ^[id]: url "optional title"
	   *
	   * ^[ ]{0,3}\[(.+)\]: // id = $1  attacklab: g_tab_width - 1
	   * [ \t]*
	   * \n?                  // maybe *one* newline
	   * [ \t]*
	   * <?(\S+?)>?          // url = $2
	   * [ \t]*
	   * \n?                // maybe one newline
	   * [ \t]*
	   * (?:
	   * (\n*)              // any lines skipped = $3 attacklab: lookbehind removed
	   * ["(]
	   * (.+?)              // title = $4
	   * [")]
	   * [ \t]*
	   * )?                 // title is optional
	   * (?:\n+|$)
	   * /gm,
	   * function(){...});
	   *
	   */
	  showdown.subParser('stripLinkDefinitions', function (text, options, globals) {
	    'use strict';

	    var regex = /^ {0,3}\[(.+)]:[ \t]*\n?[ \t]*<?(\S+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=~0))/gm;

	    // attacklab: sentinel workarounds for lack of \A and \Z, safari\khtml bug
	    text += '~0';

	    text = text.replace(regex, function (wholeMatch, linkId, url, width, height, blankLines, title) {
	      linkId = linkId.toLowerCase();
	      globals.gUrls[linkId] = showdown.subParser('encodeAmpsAndAngles')(url); // Link IDs are case-insensitive

	      if (blankLines) {
	        // Oops, found blank lines, so it's not a title.
	        // Put back the parenthetical statement we stole.
	        return blankLines + title;
	      } else {
	        if (title) {
	          globals.gTitles[linkId] = title.replace(/"|'/g, '&quot;');
	        }
	        if (options.parseImgDimensions && width && height) {
	          globals.gDimensions[linkId] = {
	            width: width,
	            height: height
	          };
	        }
	      }
	      // Completely remove the definition from the text
	      return '';
	    });

	    // attacklab: strip sentinel
	    text = text.replace(/~0/, '');

	    return text;
	  });

	  showdown.subParser('tables', function (text, options, globals) {
	    'use strict';

	    var table = function table() {

	      var tables = {},
	          filter;

	      tables.th = function (header, style) {
	        var id = '';
	        header = header.trim();
	        if (header === '') {
	          return '';
	        }
	        if (options.tableHeaderId) {
	          id = ' id="' + header.replace(/ /g, '_').toLowerCase() + '"';
	        }
	        header = showdown.subParser('spanGamut')(header, options, globals);
	        if (!style || style.trim() === '') {
	          style = '';
	        } else {
	          style = ' style="' + style + '"';
	        }
	        return '<th' + id + style + '>' + header + '</th>';
	      };

	      tables.td = function (cell, style) {
	        var subText = showdown.subParser('spanGamut')(cell.trim(), options, globals);
	        if (!style || style.trim() === '') {
	          style = '';
	        } else {
	          style = ' style="' + style + '"';
	        }
	        return '<td' + style + '>' + subText + '</td>';
	      };

	      tables.ths = function () {
	        var out = '',
	            i = 0,
	            hs = [].slice.apply(arguments[0]),
	            style = [].slice.apply(arguments[1]);

	        for (i; i < hs.length; i += 1) {
	          out += tables.th(hs[i], style[i]) + '\n';
	        }

	        return out;
	      };

	      tables.tds = function () {
	        var out = '',
	            i = 0,
	            ds = [].slice.apply(arguments[0]),
	            style = [].slice.apply(arguments[1]);

	        for (i; i < ds.length; i += 1) {
	          out += tables.td(ds[i], style[i]) + '\n';
	        }
	        return out;
	      };

	      tables.thead = function () {
	        var out,
	            hs = [].slice.apply(arguments[0]),
	            style = [].slice.apply(arguments[1]);

	        out = '<thead>\n';
	        out += '<tr>\n';
	        out += tables.ths.apply(this, [hs, style]);
	        out += '</tr>\n';
	        out += '</thead>\n';
	        return out;
	      };

	      tables.tr = function () {
	        var out,
	            cs = [].slice.apply(arguments[0]),
	            style = [].slice.apply(arguments[1]);

	        out = '<tr>\n';
	        out += tables.tds.apply(this, [cs, style]);
	        out += '</tr>\n';
	        return out;
	      };

	      filter = function (text) {
	        var i = 0,
	            lines = text.split('\n'),
	            line,
	            hs,
	            out = [];

	        for (i; i < lines.length; i += 1) {
	          line = lines[i];
	          // looks like a table heading
	          if (line.trim().match(/^[|].*[|]$/)) {
	            line = line.trim();

	            var tbl = [],
	                align = lines[i + 1].trim(),
	                styles = [],
	                j = 0;

	            if (align.match(/^[|][-=|: ]+[|]$/)) {
	              styles = align.substring(1, align.length - 1).split('|');
	              for (j = 0; j < styles.length; ++j) {
	                styles[j] = styles[j].trim();
	                if (styles[j].match(/^[:][-=| ]+[:]$/)) {
	                  styles[j] = 'text-align:center;';
	                } else if (styles[j].match(/^[-=| ]+[:]$/)) {
	                  styles[j] = 'text-align:right;';
	                } else if (styles[j].match(/^[:][-=| ]+$/)) {
	                  styles[j] = 'text-align:left;';
	                } else {
	                  styles[j] = '';
	                }
	              }
	            }
	            tbl.push('<table>');
	            hs = line.substring(1, line.length - 1).split('|');

	            if (styles.length === 0) {
	              for (j = 0; j < hs.length; ++j) {
	                styles.push('text-align:left');
	              }
	            }
	            tbl.push(tables.thead.apply(this, [hs, styles]));
	            line = lines[++i];
	            if (!line.trim().match(/^[|][-=|: ]+[|]$/)) {
	              // not a table rolling back
	              line = lines[--i];
	            } else {
	              line = lines[++i];
	              tbl.push('<tbody>');
	              while (line.trim().match(/^[|].*[|]$/)) {
	                line = line.trim();
	                tbl.push(tables.tr.apply(this, [line.substring(1, line.length - 1).split('|'), styles]));
	                line = lines[++i];
	              }
	              tbl.push('</tbody>');
	              tbl.push('</table>');
	              // we are done with this table and we move along
	              out.push(tbl.join('\n'));
	              continue;
	            }
	          }
	          out.push(line);
	        }
	        return out.join('\n');
	      };
	      return { parse: filter };
	    };

	    if (options.tables) {
	      text = globals.converter._dispatch('tables.before', text, options);
	      var tableParser = table();
	      text = tableParser.parse(text);
	      text = globals.converter._dispatch('tables.after', text, options);
	    }

	    return text;
	  });

	  /**
	   * Swap back in all the special characters we've hidden.
	   */
	  showdown.subParser('unescapeSpecialChars', function (text) {
	    'use strict';

	    text = text.replace(/~E(\d+)E/g, function (wholeMatch, m1) {
	      var charCodeToReplace = parseInt(m1);
	      return String.fromCharCode(charCodeToReplace);
	    });
	    return text;
	  });

	  var root = this;

	  // CommonJS/nodeJS Loader
	  if (typeof module !== 'undefined' && module.exports) {
	    module.exports = showdown;

	    // AMD Loader
	  } else if (true) {
	      !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	        'use strict';

	        return showdown;
	      }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	      // Regular Browser loader
	    } else {
	        root.showdown = showdown;
	      }
	}).call(undefined);

	//# sourceMappingURL=showdown.js.map

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	/** @license
	 * crossroads <http://millermedeiros.github.com/crossroads.js/>
	 * Author: Miller Medeiros | MIT License
	 * v0.12.2 (2015/07/31 18:37)
	 */

	(function () {
	    var factory = function factory(signals) {

	        var crossroads, _hasOptionalGroupBug, UNDEF;

	        // Helpers -----------
	        //====================

	        // IE 7-8 capture optional groups as empty strings while other browsers
	        // capture as `undefined`
	        _hasOptionalGroupBug = /t(.+)?/.exec('t')[1] === '';

	        function arrayIndexOf(arr, val) {
	            if (arr.indexOf) {
	                return arr.indexOf(val);
	            } else {
	                //Array.indexOf doesn't work on IE 6-7
	                var n = arr.length;
	                while (n--) {
	                    if (arr[n] === val) {
	                        return n;
	                    }
	                }
	                return -1;
	            }
	        }

	        function arrayRemove(arr, item) {
	            var i = arrayIndexOf(arr, item);
	            if (i !== -1) {
	                arr.splice(i, 1);
	            }
	        }

	        function isKind(val, kind) {
	            return '[object ' + kind + ']' === Object.prototype.toString.call(val);
	        }

	        function isRegExp(val) {
	            return isKind(val, 'RegExp');
	        }

	        function isArray(val) {
	            return isKind(val, 'Array');
	        }

	        function isFunction(val) {
	            return typeof val === 'function';
	        }

	        //borrowed from AMD-utils
	        function typecastValue(val) {
	            var r;
	            if (val === null || val === 'null') {
	                r = null;
	            } else if (val === 'true') {
	                r = true;
	            } else if (val === 'false') {
	                r = false;
	            } else if (val === UNDEF || val === 'undefined') {
	                r = UNDEF;
	            } else if (val === '' || isNaN(val)) {
	                //isNaN('') returns false
	                r = val;
	            } else {
	                //parseFloat(null || '') returns NaN
	                r = parseFloat(val);
	            }
	            return r;
	        }

	        function typecastArrayValues(values) {
	            var n = values.length,
	                result = [];
	            while (n--) {
	                result[n] = typecastValue(values[n]);
	            }
	            return result;
	        }

	        // borrowed from MOUT
	        function decodeQueryString(queryStr, shouldTypecast) {
	            var queryArr = (queryStr || '').replace('?', '').split('&'),
	                reg = /([^=]+)=(.+)/,
	                i = -1,
	                obj = {},
	                equalIndex,
	                cur,
	                pValue,
	                pName;

	            while (cur = queryArr[++i]) {
	                equalIndex = cur.indexOf('=');
	                pName = cur.substring(0, equalIndex);
	                pValue = decodeURIComponent(cur.substring(equalIndex + 1));
	                if (shouldTypecast !== false) {
	                    pValue = typecastValue(pValue);
	                }
	                if (pName in obj) {
	                    if (isArray(obj[pName])) {
	                        obj[pName].push(pValue);
	                    } else {
	                        obj[pName] = [obj[pName], pValue];
	                    }
	                } else {
	                    obj[pName] = pValue;
	                }
	            }
	            return obj;
	        }

	        // Crossroads --------
	        //====================

	        /**
	         * @constructor
	         */
	        function Crossroads() {
	            this.bypassed = new signals.Signal();
	            this.routed = new signals.Signal();
	            this._routes = [];
	            this._prevRoutes = [];
	            this._piped = [];
	            this.resetState();
	        }

	        Crossroads.prototype = {

	            greedy: false,

	            greedyEnabled: true,

	            ignoreCase: true,

	            ignoreState: false,

	            shouldTypecast: false,

	            normalizeFn: null,

	            resetState: function resetState() {
	                this._prevRoutes.length = 0;
	                this._prevMatchedRequest = null;
	                this._prevBypassedRequest = null;
	            },

	            create: function create() {
	                return new Crossroads();
	            },

	            addRoute: function addRoute(pattern, callback, priority) {
	                var route = new Route(pattern, callback, priority, this);
	                this._sortedInsert(route);
	                return route;
	            },

	            removeRoute: function removeRoute(route) {
	                arrayRemove(this._routes, route);
	                route._destroy();
	            },

	            removeAllRoutes: function removeAllRoutes() {
	                var n = this.getNumRoutes();
	                while (n--) {
	                    this._routes[n]._destroy();
	                }
	                this._routes.length = 0;
	            },

	            parse: function parse(request, defaultArgs) {
	                request = request || '';
	                defaultArgs = defaultArgs || [];

	                // should only care about different requests if ignoreState isn't true
	                if (!this.ignoreState && (request === this._prevMatchedRequest || request === this._prevBypassedRequest)) {
	                    return;
	                }

	                var routes = this._getMatchedRoutes(request),
	                    i = 0,
	                    n = routes.length,
	                    cur;

	                if (n) {
	                    this._prevMatchedRequest = request;

	                    this._notifyPrevRoutes(routes, request);
	                    this._prevRoutes = routes;
	                    //should be incremental loop, execute routes in order
	                    while (i < n) {
	                        cur = routes[i];
	                        cur.route.matched.dispatch.apply(cur.route.matched, defaultArgs.concat(cur.params));
	                        cur.isFirst = !i;
	                        this.routed.dispatch.apply(this.routed, defaultArgs.concat([request, cur]));
	                        i += 1;
	                    }
	                } else {
	                    this._prevBypassedRequest = request;
	                    this.bypassed.dispatch.apply(this.bypassed, defaultArgs.concat([request]));
	                }

	                this._pipeParse(request, defaultArgs);
	            },

	            _notifyPrevRoutes: function _notifyPrevRoutes(matchedRoutes, request) {
	                var i = 0,
	                    prev;
	                while (prev = this._prevRoutes[i++]) {
	                    //check if switched exist since route may be disposed
	                    if (prev.route.switched && this._didSwitch(prev.route, matchedRoutes)) {
	                        prev.route.switched.dispatch(request);
	                    }
	                }
	            },

	            _didSwitch: function _didSwitch(route, matchedRoutes) {
	                var matched,
	                    i = 0;
	                while (matched = matchedRoutes[i++]) {
	                    // only dispatch switched if it is going to a different route
	                    if (matched.route === route) {
	                        return false;
	                    }
	                }
	                return true;
	            },

	            _pipeParse: function _pipeParse(request, defaultArgs) {
	                var i = 0,
	                    route;
	                while (route = this._piped[i++]) {
	                    route.parse(request, defaultArgs);
	                }
	            },

	            getNumRoutes: function getNumRoutes() {
	                return this._routes.length;
	            },

	            _sortedInsert: function _sortedInsert(route) {
	                //simplified insertion sort
	                var routes = this._routes,
	                    n = routes.length;
	                do {
	                    --n;
	                } while (routes[n] && route._priority <= routes[n]._priority);
	                routes.splice(n + 1, 0, route);
	            },

	            _getMatchedRoutes: function _getMatchedRoutes(request) {
	                var res = [],
	                    routes = this._routes,
	                    n = routes.length,
	                    route;
	                //should be decrement loop since higher priorities are added at the end of array
	                while (route = routes[--n]) {
	                    if ((!res.length || this.greedy || route.greedy) && route.match(request)) {
	                        res.push({
	                            route: route,
	                            params: route._getParamsArray(request)
	                        });
	                    }
	                    if (!this.greedyEnabled && res.length) {
	                        break;
	                    }
	                }
	                return res;
	            },

	            pipe: function pipe(otherRouter) {
	                this._piped.push(otherRouter);
	            },

	            unpipe: function unpipe(otherRouter) {
	                arrayRemove(this._piped, otherRouter);
	            },

	            toString: function toString() {
	                return '[crossroads numRoutes:' + this.getNumRoutes() + ']';
	            }
	        };

	        //"static" instance
	        crossroads = new Crossroads();
	        crossroads.VERSION = '0.12.2';

	        crossroads.NORM_AS_ARRAY = function (req, vals) {
	            return [vals.vals_];
	        };

	        crossroads.NORM_AS_OBJECT = function (req, vals) {
	            return [vals];
	        };

	        // Route --------------
	        //=====================

	        /**
	         * @constructor
	         */
	        function Route(pattern, callback, priority, router) {
	            var isRegexPattern = isRegExp(pattern),
	                patternLexer = router.patternLexer;
	            this._router = router;
	            this._pattern = pattern;
	            this._paramsIds = isRegexPattern ? null : patternLexer.getParamIds(pattern);
	            this._optionalParamsIds = isRegexPattern ? null : patternLexer.getOptionalParamsIds(pattern);
	            this._matchRegexp = isRegexPattern ? pattern : patternLexer.compilePattern(pattern, router.ignoreCase);
	            this.matched = new signals.Signal();
	            this.switched = new signals.Signal();
	            if (callback) {
	                this.matched.add(callback);
	            }
	            this._priority = priority || 0;
	        }

	        Route.prototype = {

	            greedy: false,

	            rules: void 0,

	            match: function match(request) {
	                request = request || '';
	                return this._matchRegexp.test(request) && this._validateParams(request); //validate params even if regexp because of `request_` rule.
	            },

	            _validateParams: function _validateParams(request) {
	                var rules = this.rules,
	                    values = this._getParamsObject(request),
	                    key;
	                for (key in rules) {
	                    // normalize_ isn't a validation rule... (#39)
	                    if (key !== 'normalize_' && rules.hasOwnProperty(key) && !this._isValidParam(request, key, values)) {
	                        return false;
	                    }
	                }
	                return true;
	            },

	            _isValidParam: function _isValidParam(request, prop, values) {
	                var validationRule = this.rules[prop],
	                    val = values[prop],
	                    isValid = false,
	                    isQuery = prop.indexOf('?') === 0;

	                if (val == null && this._optionalParamsIds && arrayIndexOf(this._optionalParamsIds, prop) !== -1) {
	                    isValid = true;
	                } else if (isRegExp(validationRule)) {
	                    if (isQuery) {
	                        val = values[prop + '_']; //use raw string
	                    }
	                    isValid = validationRule.test(val);
	                } else if (isArray(validationRule)) {
	                    if (isQuery) {
	                        val = values[prop + '_']; //use raw string
	                    }
	                    isValid = this._isValidArrayRule(validationRule, val);
	                } else if (isFunction(validationRule)) {
	                    isValid = validationRule(val, request, values);
	                }

	                return isValid; //fail silently if validationRule is from an unsupported type
	            },

	            _isValidArrayRule: function _isValidArrayRule(arr, val) {
	                if (!this._router.ignoreCase) {
	                    return arrayIndexOf(arr, val) !== -1;
	                }

	                if (typeof val === 'string') {
	                    val = val.toLowerCase();
	                }

	                var n = arr.length,
	                    item,
	                    compareVal;

	                while (n--) {
	                    item = arr[n];
	                    compareVal = typeof item === 'string' ? item.toLowerCase() : item;
	                    if (compareVal === val) {
	                        return true;
	                    }
	                }
	                return false;
	            },

	            _getParamsObject: function _getParamsObject(request) {
	                var shouldTypecast = this._router.shouldTypecast,
	                    values = this._router.patternLexer.getParamValues(request, this._matchRegexp, shouldTypecast),
	                    o = {},
	                    n = values.length,
	                    param,
	                    val;
	                while (n--) {
	                    val = values[n];
	                    if (this._paramsIds) {
	                        param = this._paramsIds[n];
	                        if (param.indexOf('?') === 0 && val) {
	                            //make a copy of the original string so array and
	                            //RegExp validation can be applied properly
	                            o[param + '_'] = val;
	                            //update vals_ array as well since it will be used
	                            //during dispatch
	                            val = decodeQueryString(val, shouldTypecast);
	                            values[n] = val;
	                        }
	                        // IE will capture optional groups as empty strings while other
	                        // browsers will capture `undefined` so normalize behavior.
	                        // see: #gh-58, #gh-59, #gh-60
	                        if (_hasOptionalGroupBug && val === '' && arrayIndexOf(this._optionalParamsIds, param) !== -1) {
	                            val = void 0;
	                            values[n] = val;
	                        }
	                        o[param] = val;
	                    }
	                    //alias to paths and for RegExp pattern
	                    o[n] = val;
	                }
	                o.request_ = shouldTypecast ? typecastValue(request) : request;
	                o.vals_ = values;
	                return o;
	            },

	            _getParamsArray: function _getParamsArray(request) {
	                var norm = this.rules ? this.rules.normalize_ : null,
	                    params;
	                norm = norm || this._router.normalizeFn; // default normalize
	                if (norm && isFunction(norm)) {
	                    params = norm(request, this._getParamsObject(request));
	                } else {
	                    params = this._getParamsObject(request).vals_;
	                }
	                return params;
	            },

	            interpolate: function interpolate(replacements) {
	                var str = this._router.patternLexer.interpolate(this._pattern, replacements);
	                if (!this._validateParams(str)) {
	                    throw new Error('Generated string doesn\'t validate against `Route.rules`.');
	                }
	                return str;
	            },

	            dispose: function dispose() {
	                this._router.removeRoute(this);
	            },

	            _destroy: function _destroy() {
	                this.matched.dispose();
	                this.switched.dispose();
	                this.matched = this.switched = this._pattern = this._matchRegexp = null;
	            },

	            toString: function toString() {
	                return '[Route pattern:"' + this._pattern + '", numListeners:' + this.matched.getNumListeners() + ']';
	            }

	        };

	        // Pattern Lexer ------
	        //=====================

	        Crossroads.prototype.patternLexer = (function () {

	            var
	            //match chars that should be escaped on string regexp
	            ESCAPE_CHARS_REGEXP = /[\\.+*?\^$\[\](){}\/'#]/g,

	            //trailing slashes (begin/end of string)
	            LOOSE_SLASHES_REGEXP = /^\/|\/$/g,
	                LEGACY_SLASHES_REGEXP = /\/$/g,

	            //params - everything between `{ }` or `: :`
	            PARAMS_REGEXP = /(?:\{|:)([^}:]+)(?:\}|:)/g,

	            //used to save params during compile (avoid escaping things that
	            //shouldn't be escaped).
	            TOKENS = {
	                'OS': {
	                    //optional slashes
	                    //slash between `::` or `}:` or `\w:` or `:{?` or `}{?` or `\w{?`
	                    rgx: /([:}]|\w(?=\/))\/?(:|(?:\{\?))/g,
	                    save: '$1{{id}}$2',
	                    res: '\\/?'
	                },
	                'RS': {
	                    //required slashes
	                    //used to insert slash between `:{` and `}{`
	                    rgx: /([:}])\/?(\{)/g,
	                    save: '$1{{id}}$2',
	                    res: '\\/'
	                },
	                'RQ': {
	                    //required query string - everything in between `{? }`
	                    rgx: /\{\?([^}]+)\}/g,
	                    //everything from `?` till `#` or end of string
	                    res: '\\?([^#]+)'
	                },
	                'OQ': {
	                    //optional query string - everything in between `:? :`
	                    rgx: /:\?([^:]+):/g,
	                    //everything from `?` till `#` or end of string
	                    res: '(?:\\?([^#]*))?'
	                },
	                'OR': {
	                    //optional rest - everything in between `: *:`
	                    rgx: /:([^:]+)\*:/g,
	                    res: '(.*)?' // optional group to avoid passing empty string as captured
	                },
	                'RR': {
	                    //rest param - everything in between `{ *}`
	                    rgx: /\{([^}]+)\*\}/g,
	                    res: '(.+)'
	                },
	                // required/optional params should come after rest segments
	                'RP': {
	                    //required params - everything between `{ }`
	                    rgx: /\{([^}]+)\}/g,
	                    res: '([^\\/?]+)'
	                },
	                'OP': {
	                    //optional params - everything between `: :`
	                    rgx: /:([^:]+):/g,
	                    res: '([^\\/?]+)?\/?'
	                }
	            },
	                LOOSE_SLASH = 1,
	                STRICT_SLASH = 2,
	                LEGACY_SLASH = 3,
	                _slashMode = LOOSE_SLASH;

	            function precompileTokens() {
	                var key, cur;
	                for (key in TOKENS) {
	                    if (TOKENS.hasOwnProperty(key)) {
	                        cur = TOKENS[key];
	                        cur.id = '__CR_' + key + '__';
	                        cur.save = 'save' in cur ? cur.save.replace('{{id}}', cur.id) : cur.id;
	                        cur.rRestore = new RegExp(cur.id, 'g');
	                    }
	                }
	            }
	            precompileTokens();

	            function captureVals(regex, pattern) {
	                var vals = [],
	                    match;
	                // very important to reset lastIndex since RegExp can have "g" flag
	                // and multiple runs might affect the result, specially if matching
	                // same string multiple times on IE 7-8
	                regex.lastIndex = 0;
	                while (match = regex.exec(pattern)) {
	                    vals.push(match[1]);
	                }
	                return vals;
	            }

	            function getParamIds(pattern) {
	                return captureVals(PARAMS_REGEXP, pattern);
	            }

	            function getOptionalParamsIds(pattern) {
	                return captureVals(TOKENS.OP.rgx, pattern);
	            }

	            function compilePattern(pattern, ignoreCase) {
	                pattern = pattern || '';

	                if (pattern) {
	                    if (_slashMode === LOOSE_SLASH) {
	                        pattern = pattern.replace(LOOSE_SLASHES_REGEXP, '');
	                    } else if (_slashMode === LEGACY_SLASH) {
	                        pattern = pattern.replace(LEGACY_SLASHES_REGEXP, '');
	                    }

	                    //save tokens
	                    pattern = replaceTokens(pattern, 'rgx', 'save');
	                    //regexp escape
	                    pattern = pattern.replace(ESCAPE_CHARS_REGEXP, '\\$&');
	                    //restore tokens
	                    pattern = replaceTokens(pattern, 'rRestore', 'res');

	                    if (_slashMode === LOOSE_SLASH) {
	                        pattern = '\\/?' + pattern;
	                    }
	                }

	                if (_slashMode !== STRICT_SLASH) {
	                    //single slash is treated as empty and end slash is optional
	                    pattern += '\\/?';
	                }
	                return new RegExp('^' + pattern + '$', ignoreCase ? 'i' : '');
	            }

	            function replaceTokens(pattern, regexpName, replaceName) {
	                var cur, key;
	                for (key in TOKENS) {
	                    if (TOKENS.hasOwnProperty(key)) {
	                        cur = TOKENS[key];
	                        pattern = pattern.replace(cur[regexpName], cur[replaceName]);
	                    }
	                }
	                return pattern;
	            }

	            function getParamValues(request, regexp, shouldTypecast) {
	                var vals = regexp.exec(request);
	                if (vals) {
	                    vals.shift();
	                    if (shouldTypecast) {
	                        vals = typecastArrayValues(vals);
	                    }
	                }
	                return vals;
	            }

	            function interpolate(pattern, replacements) {
	                // default to an empty object because pattern might have just
	                // optional arguments
	                replacements = replacements || {};
	                if (typeof pattern !== 'string') {
	                    throw new Error('Route pattern should be a string.');
	                }

	                var replaceFn = function replaceFn(match, prop) {
	                    var val;
	                    prop = prop.substr(0, 1) === '?' ? prop.substr(1) : prop;
	                    if (replacements[prop] != null) {
	                        if (_typeof(replacements[prop]) === 'object') {
	                            var queryParts = [],
	                                rep;
	                            for (var key in replacements[prop]) {
	                                rep = replacements[prop][key];
	                                if (isArray(rep)) {
	                                    for (var k in rep) {
	                                        if (key.slice(-2) == '[]') {
	                                            queryParts.push(encodeURI(key.slice(0, -2)) + '[]=' + encodeURI(rep[k]));
	                                        } else {
	                                            queryParts.push(encodeURI(key + '=' + rep[k]));
	                                        }
	                                    }
	                                } else {
	                                    queryParts.push(encodeURI(key + '=' + rep));
	                                }
	                            }
	                            val = '?' + queryParts.join('&');
	                        } else {
	                            // make sure value is a string see #gh-54
	                            val = String(replacements[prop]);
	                        }

	                        if (match.indexOf('*') === -1 && val.indexOf('/') !== -1) {
	                            throw new Error('Invalid value "' + val + '" for segment "' + match + '".');
	                        }
	                    } else if (match.indexOf('{') !== -1) {
	                        throw new Error('The segment ' + match + ' is required.');
	                    } else {
	                        val = '';
	                    }
	                    return val;
	                };

	                if (!TOKENS.OS.trail) {
	                    TOKENS.OS.trail = new RegExp('(?:' + TOKENS.OS.id + ')+$');
	                }

	                return pattern.replace(TOKENS.OS.rgx, TOKENS.OS.save).replace(PARAMS_REGEXP, replaceFn).replace(TOKENS.OS.trail, '') // remove trailing
	                .replace(TOKENS.OS.rRestore, '/'); // add slash between segments
	            }

	            //API
	            return {
	                strict: function strict() {
	                    _slashMode = STRICT_SLASH;
	                },
	                loose: function loose() {
	                    _slashMode = LOOSE_SLASH;
	                },
	                legacy: function legacy() {
	                    _slashMode = LEGACY_SLASH;
	                },
	                getParamIds: getParamIds,
	                getOptionalParamsIds: getOptionalParamsIds,
	                getParamValues: getParamValues,
	                compilePattern: compilePattern,
	                interpolate: interpolate
	            };
	        })();

	        return crossroads;
	    };

	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(9)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module !== 'undefined' && module.exports) {
	        //Node
	        module.exports = factory(require('signals'));
	    } else {
	        /*jshint sub:true */
	        window['crossroads'] = factory(window['signals']);
	    }
	})();

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	/*jslint onevar:true, undef:true, newcap:true, regexp:true, bitwise:true, maxerr:50, indent:4, white:false, nomen:false, plusplus:false */
	/*global define:false, require:false, exports:false, module:false, signals:false */

	/** @license
	 * JS Signals <http://millermedeiros.github.com/js-signals/>
	 * Released under the MIT license
	 * Author: Miller Medeiros
	 * Version: 1.0.0 - Build: 268 (2012/11/29 05:48 PM)
	 */

	(function (global) {

	    // SignalBinding -------------------------------------------------
	    //================================================================

	    /**
	     * Object that represents a binding between a Signal and a listener function.
	     * <br />- <strong>This is an internal constructor and shouldn't be called by regular users.</strong>
	     * <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
	     * @author Miller Medeiros
	     * @constructor
	     * @internal
	     * @name SignalBinding
	     * @param {Signal} signal Reference to Signal object that listener is currently bound to.
	     * @param {Function} listener Handler function bound to the signal.
	     * @param {boolean} isOnce If binding should be executed just once.
	     * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
	     * @param {Number} [priority] The priority level of the event listener. (default = 0).
	     */
	    function SignalBinding(signal, listener, isOnce, listenerContext, priority) {

	        /**
	         * Handler function bound to the signal.
	         * @type Function
	         * @private
	         */
	        this._listener = listener;

	        /**
	         * If binding should be executed just once.
	         * @type boolean
	         * @private
	         */
	        this._isOnce = isOnce;

	        /**
	         * Context on which listener will be executed (object that should represent the `this` variable inside listener function).
	         * @memberOf SignalBinding.prototype
	         * @name context
	         * @type Object|undefined|null
	         */
	        this.context = listenerContext;

	        /**
	         * Reference to Signal object that listener is currently bound to.
	         * @type Signal
	         * @private
	         */
	        this._signal = signal;

	        /**
	         * Listener priority
	         * @type Number
	         * @private
	         */
	        this._priority = priority || 0;
	    }

	    SignalBinding.prototype = {

	        /**
	         * If binding is active and should be executed.
	         * @type boolean
	         */
	        active: true,

	        /**
	         * Default parameters passed to listener during `Signal.dispatch` and `SignalBinding.execute`. (curried parameters)
	         * @type Array|null
	         */
	        params: null,

	        /**
	         * Call listener passing arbitrary parameters.
	         * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p>
	         * @param {Array} [paramsArr] Array of parameters that should be passed to the listener
	         * @return {*} Value returned by the listener.
	         */
	        execute: function execute(paramsArr) {
	            var handlerReturn, params;
	            if (this.active && !!this._listener) {
	                params = this.params ? this.params.concat(paramsArr) : paramsArr;
	                handlerReturn = this._listener.apply(this.context, params);
	                if (this._isOnce) {
	                    this.detach();
	                }
	            }
	            return handlerReturn;
	        },

	        /**
	         * Detach binding from signal.
	         * - alias to: mySignal.remove(myBinding.getListener());
	         * @return {Function|null} Handler function bound to the signal or `null` if binding was previously detached.
	         */
	        detach: function detach() {
	            return this.isBound() ? this._signal.remove(this._listener, this.context) : null;
	        },

	        /**
	         * @return {Boolean} `true` if binding is still bound to the signal and have a listener.
	         */
	        isBound: function isBound() {
	            return !!this._signal && !!this._listener;
	        },

	        /**
	         * @return {boolean} If SignalBinding will only be executed once.
	         */
	        isOnce: function isOnce() {
	            return this._isOnce;
	        },

	        /**
	         * @return {Function} Handler function bound to the signal.
	         */
	        getListener: function getListener() {
	            return this._listener;
	        },

	        /**
	         * @return {Signal} Signal that listener is currently bound to.
	         */
	        getSignal: function getSignal() {
	            return this._signal;
	        },

	        /**
	         * Delete instance properties
	         * @private
	         */
	        _destroy: function _destroy() {
	            delete this._signal;
	            delete this._listener;
	            delete this.context;
	        },

	        /**
	         * @return {string} String representation of the object.
	         */
	        toString: function toString() {
	            return '[SignalBinding isOnce:' + this._isOnce + ', isBound:' + this.isBound() + ', active:' + this.active + ']';
	        }

	    };

	    /*global SignalBinding:false*/

	    // Signal --------------------------------------------------------
	    //================================================================

	    function validateListener(listener, fnName) {
	        if (typeof listener !== 'function') {
	            throw new Error('listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName));
	        }
	    }

	    /**
	     * Custom event broadcaster
	     * <br />- inspired by Robert Penner's AS3 Signals.
	     * @name Signal
	     * @author Miller Medeiros
	     * @constructor
	     */
	    function Signal() {
	        /**
	         * @type Array.<SignalBinding>
	         * @private
	         */
	        this._bindings = [];
	        this._prevParams = null;

	        // enforce dispatch to aways work on same context (#47)
	        var self = this;
	        this.dispatch = function () {
	            Signal.prototype.dispatch.apply(self, arguments);
	        };
	    }

	    Signal.prototype = {

	        /**
	         * Signals Version Number
	         * @type String
	         * @const
	         */
	        VERSION: '1.0.0',

	        /**
	         * If Signal should keep record of previously dispatched parameters and
	         * automatically execute listener during `add()`/`addOnce()` if Signal was
	         * already dispatched before.
	         * @type boolean
	         */
	        memorize: false,

	        /**
	         * @type boolean
	         * @private
	         */
	        _shouldPropagate: true,

	        /**
	         * If Signal is active and should broadcast events.
	         * <p><strong>IMPORTANT:</strong> Setting this property during a dispatch will only affect the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
	         * @type boolean
	         */
	        active: true,

	        /**
	         * @param {Function} listener
	         * @param {boolean} isOnce
	         * @param {Object} [listenerContext]
	         * @param {Number} [priority]
	         * @return {SignalBinding}
	         * @private
	         */
	        _registerListener: function _registerListener(listener, isOnce, listenerContext, priority) {

	            var prevIndex = this._indexOfListener(listener, listenerContext),
	                binding;

	            if (prevIndex !== -1) {
	                binding = this._bindings[prevIndex];
	                if (binding.isOnce() !== isOnce) {
	                    throw new Error('You cannot add' + (isOnce ? '' : 'Once') + '() then add' + (!isOnce ? '' : 'Once') + '() the same listener without removing the relationship first.');
	                }
	            } else {
	                binding = new SignalBinding(this, listener, isOnce, listenerContext, priority);
	                this._addBinding(binding);
	            }

	            if (this.memorize && this._prevParams) {
	                binding.execute(this._prevParams);
	            }

	            return binding;
	        },

	        /**
	         * @param {SignalBinding} binding
	         * @private
	         */
	        _addBinding: function _addBinding(binding) {
	            //simplified insertion sort
	            var n = this._bindings.length;
	            do {
	                --n;
	            } while (this._bindings[n] && binding._priority <= this._bindings[n]._priority);
	            this._bindings.splice(n + 1, 0, binding);
	        },

	        /**
	         * @param {Function} listener
	         * @return {number}
	         * @private
	         */
	        _indexOfListener: function _indexOfListener(listener, context) {
	            var n = this._bindings.length,
	                cur;
	            while (n--) {
	                cur = this._bindings[n];
	                if (cur._listener === listener && cur.context === context) {
	                    return n;
	                }
	            }
	            return -1;
	        },

	        /**
	         * Check if listener was attached to Signal.
	         * @param {Function} listener
	         * @param {Object} [context]
	         * @return {boolean} if Signal has the specified listener.
	         */
	        has: function has(listener, context) {
	            return this._indexOfListener(listener, context) !== -1;
	        },

	        /**
	         * Add a listener to the signal.
	         * @param {Function} listener Signal handler function.
	         * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
	         * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
	         * @return {SignalBinding} An Object representing the binding between the Signal and listener.
	         */
	        add: function add(listener, listenerContext, priority) {
	            validateListener(listener, 'add');
	            return this._registerListener(listener, false, listenerContext, priority);
	        },

	        /**
	         * Add listener to the signal that should be removed after first execution (will be executed only once).
	         * @param {Function} listener Signal handler function.
	         * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
	         * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
	         * @return {SignalBinding} An Object representing the binding between the Signal and listener.
	         */
	        addOnce: function addOnce(listener, listenerContext, priority) {
	            validateListener(listener, 'addOnce');
	            return this._registerListener(listener, true, listenerContext, priority);
	        },

	        /**
	         * Remove a single listener from the dispatch queue.
	         * @param {Function} listener Handler function that should be removed.
	         * @param {Object} [context] Execution context (since you can add the same handler multiple times if executing in a different context).
	         * @return {Function} Listener handler function.
	         */
	        remove: function remove(listener, context) {
	            validateListener(listener, 'remove');

	            var i = this._indexOfListener(listener, context);
	            if (i !== -1) {
	                this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal
	                this._bindings.splice(i, 1);
	            }
	            return listener;
	        },

	        /**
	         * Remove all listeners from the Signal.
	         */
	        removeAll: function removeAll() {
	            var n = this._bindings.length;
	            while (n--) {
	                this._bindings[n]._destroy();
	            }
	            this._bindings.length = 0;
	        },

	        /**
	         * @return {number} Number of listeners attached to the Signal.
	         */
	        getNumListeners: function getNumListeners() {
	            return this._bindings.length;
	        },

	        /**
	         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
	         * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
	         * @see Signal.prototype.disable
	         */
	        halt: function halt() {
	            this._shouldPropagate = false;
	        },

	        /**
	         * Dispatch/Broadcast Signal to all listeners added to the queue.
	         * @param {...*} [params] Parameters that should be passed to each handler.
	         */
	        dispatch: function dispatch(params) {
	            if (!this.active) {
	                return;
	            }

	            var paramsArr = Array.prototype.slice.call(arguments),
	                n = this._bindings.length,
	                bindings;

	            if (this.memorize) {
	                this._prevParams = paramsArr;
	            }

	            if (!n) {
	                //should come after memorize
	                return;
	            }

	            bindings = this._bindings.slice(); //clone array in case add/remove items during dispatch
	            this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.

	            //execute all callbacks until end of the list or until a callback returns `false` or stops propagation
	            //reverse loop since listeners with higher priority will be added at the end of the list
	            do {
	                n--;
	            } while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
	        },

	        /**
	         * Forget memorized arguments.
	         * @see Signal.memorize
	         */
	        forget: function forget() {
	            this._prevParams = null;
	        },

	        /**
	         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
	         * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
	         */
	        dispose: function dispose() {
	            this.removeAll();
	            delete this._bindings;
	            delete this._prevParams;
	        },

	        /**
	         * @return {string} String representation of the object.
	         */
	        toString: function toString() {
	            return '[Signal active:' + this.active + ' numListeners:' + this.getNumListeners() + ']';
	        }

	    };

	    // Namespace -----------------------------------------------------
	    //================================================================

	    /**
	     * Signals namespace
	     * @namespace
	     * @name signals
	     */
	    var signals = Signal;

	    /**
	     * Custom event broadcaster
	     * @see Signal
	     */
	    // alias for backwards compatibility (see #gh-44)
	    signals.Signal = Signal;

	    //exports to multiple environments
	    if (true) {
	        //AMD
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return signals;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module !== 'undefined' && module.exports) {
	        //node
	        module.exports = signals;
	    } else {
	        //browser
	        //use string because of Google closure compiler ADVANCED_MODE
	        /*jslint sub:true */
	        global['signals'] = signals;
	    }
	})(undefined);

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	/*!!
	 * Hasher <http://github.com/millermedeiros/hasher>
	 * @author Miller Medeiros
	 * @version 1.2.0 (2013/11/11 03:18 PM)
	 * Released under the MIT License
	 */

	;(function () {
	    var factory = function factory(signals) {

	        /*jshint white:false*/
	        /*global signals:false, window:false*/

	        /**
	         * Hasher
	         * @namespace History Manager for rich-media applications.
	         * @name hasher
	         */
	        var hasher = (function (window) {

	            //--------------------------------------------------------------------------------------
	            // Private Vars
	            //--------------------------------------------------------------------------------------

	            var

	            // frequency that it will check hash value on IE 6-7 since it doesn't
	            // support the hashchange event
	            POOL_INTERVAL = 25,

	            // local storage for brevity and better compression --------------------------------

	            document = window.document,
	                history = window.history,
	                Signal = signals.Signal,

	            // local vars ----------------------------------------------------------------------

	            hasher,
	                _hash,
	                _checkInterval,
	                _isActive,
	                _frame,
	                //iframe used for legacy IE (6-7)
	            _checkHistory,
	                _hashValRegexp = /#(.*)$/,
	                _baseUrlRegexp = /(\?.*)|(\#.*)/,
	                _hashRegexp = /^\#/,

	            // sniffing/feature detection -------------------------------------------------------

	            //hack based on this: http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
	            _isIE = ! +"\v1",

	            // hashchange is supported by FF3.6+, IE8+, Chrome 5+, Safari 5+ but
	            // feature detection fails on IE compatibility mode, so we need to
	            // check documentMode
	            _isHashChangeSupported = 'onhashchange' in window && document.documentMode !== 7,

	            //check if is IE6-7 since hash change is only supported on IE8+ and
	            //changing hash value on IE6-7 doesn't generate history record.
	            _isLegacyIE = _isIE && !_isHashChangeSupported,
	                _isLocal = location.protocol === 'file:';

	            //--------------------------------------------------------------------------------------
	            // Private Methods
	            //--------------------------------------------------------------------------------------

	            function _escapeRegExp(str) {
	                return String(str || '').replace(/\W/g, "\\$&");
	            }

	            function _trimHash(hash) {
	                if (!hash) return '';
	                var regexp = new RegExp('^' + _escapeRegExp(hasher.prependHash) + '|' + _escapeRegExp(hasher.appendHash) + '$', 'g');
	                return hash.replace(regexp, '');
	            }

	            function _getWindowHash() {
	                //parsed full URL instead of getting window.location.hash because Firefox decode hash value (and all the other browsers don't)
	                //also because of IE8 bug with hash query in local file [issue #6]
	                var result = _hashValRegexp.exec(hasher.getURL());
	                var path = result && result[1] || '';
	                try {
	                    return hasher.raw ? path : decodeURIComponent(path);
	                } catch (e) {
	                    // in case user did not set `hasher.raw` and decodeURIComponent
	                    // throws an error (see #57)
	                    return path;
	                }
	            }

	            function _getFrameHash() {
	                return _frame ? _frame.contentWindow.frameHash : null;
	            }

	            function _createFrame() {
	                _frame = document.createElement('iframe');
	                _frame.src = 'about:blank';
	                _frame.style.display = 'none';
	                document.body.appendChild(_frame);
	            }

	            function _updateFrame() {
	                if (_frame && _hash !== _getFrameHash()) {
	                    var frameDoc = _frame.contentWindow.document;
	                    frameDoc.open();
	                    //update iframe content to force new history record.
	                    //based on Really Simple History, SWFAddress and YUI.history.
	                    frameDoc.write('<html><head><title>' + document.title + '</title><script type="text/javascript">var frameHash="' + _hash + '";</script></head><body>&nbsp;</body></html>');
	                    frameDoc.close();
	                }
	            }

	            function _registerChange(newHash, isReplace) {
	                if (_hash !== newHash) {
	                    var oldHash = _hash;
	                    _hash = newHash; //should come before event dispatch to make sure user can get proper value inside event handler
	                    if (_isLegacyIE) {
	                        if (!isReplace) {
	                            _updateFrame();
	                        } else {
	                            _frame.contentWindow.frameHash = newHash;
	                        }
	                    }
	                    hasher.changed.dispatch(_trimHash(newHash), _trimHash(oldHash));
	                }
	            }

	            if (_isLegacyIE) {
	                /**
	                 * @private
	                 */
	                _checkHistory = function () {
	                    var windowHash = _getWindowHash(),
	                        frameHash = _getFrameHash();
	                    if (frameHash !== _hash && frameHash !== windowHash) {
	                        //detect changes made pressing browser history buttons.
	                        //Workaround since history.back() and history.forward() doesn't
	                        //update hash value on IE6/7 but updates content of the iframe.
	                        //needs to trim hash since value stored already have
	                        //prependHash + appendHash for fast check.
	                        hasher.setHash(_trimHash(frameHash));
	                    } else if (windowHash !== _hash) {
	                        //detect if hash changed (manually or using setHash)
	                        _registerChange(windowHash);
	                    }
	                };
	            } else {
	                /**
	                 * @private
	                 */
	                _checkHistory = function () {
	                    var windowHash = _getWindowHash();
	                    if (windowHash !== _hash) {
	                        _registerChange(windowHash);
	                    }
	                };
	            }

	            function _addListener(elm, eType, fn) {
	                if (elm.addEventListener) {
	                    elm.addEventListener(eType, fn, false);
	                } else if (elm.attachEvent) {
	                    elm.attachEvent('on' + eType, fn);
	                }
	            }

	            function _removeListener(elm, eType, fn) {
	                if (elm.removeEventListener) {
	                    elm.removeEventListener(eType, fn, false);
	                } else if (elm.detachEvent) {
	                    elm.detachEvent('on' + eType, fn);
	                }
	            }

	            function _makePath(paths) {
	                paths = Array.prototype.slice.call(arguments);

	                var path = paths.join(hasher.separator);
	                path = path ? hasher.prependHash + path.replace(_hashRegexp, '') + hasher.appendHash : path;
	                return path;
	            }

	            function _encodePath(path) {
	                //used encodeURI instead of encodeURIComponent to preserve '?', '/',
	                //'#'. Fixes Safari bug [issue #8]
	                path = encodeURI(path);
	                if (_isIE && _isLocal) {
	                    //fix IE8 local file bug [issue #6]
	                    path = path.replace(/\?/, '%3F');
	                }
	                return path;
	            }

	            //--------------------------------------------------------------------------------------
	            // Public (API)
	            //--------------------------------------------------------------------------------------

	            hasher = /** @lends hasher */{

	                /**
	                 * hasher Version Number
	                 * @type string
	                 * @constant
	                 */
	                VERSION: '1.2.0',

	                /**
	                 * Boolean deciding if hasher encodes/decodes the hash or not.
	                 * <ul>
	                 * <li>default value: false;</li>
	                 * </ul>
	                 * @type boolean
	                 */
	                raw: false,

	                /**
	                 * String that should always be added to the end of Hash value.
	                 * <ul>
	                 * <li>default value: '';</li>
	                 * <li>will be automatically removed from `hasher.getHash()`</li>
	                 * <li>avoid conflicts with elements that contain ID equal to hash value;</li>
	                 * </ul>
	                 * @type string
	                 */
	                appendHash: '',

	                /**
	                 * String that should always be added to the beginning of Hash value.
	                 * <ul>
	                 * <li>default value: '/';</li>
	                 * <li>will be automatically removed from `hasher.getHash()`</li>
	                 * <li>avoid conflicts with elements that contain ID equal to hash value;</li>
	                 * </ul>
	                 * @type string
	                 */
	                prependHash: '/',

	                /**
	                 * String used to split hash paths; used by `hasher.getHashAsArray()` to split paths.
	                 * <ul>
	                 * <li>default value: '/';</li>
	                 * </ul>
	                 * @type string
	                 */
	                separator: '/',

	                /**
	                 * Signal dispatched when hash value changes.
	                 * - pass current hash as 1st parameter to listeners and previous hash value as 2nd parameter.
	                 * @type signals.Signal
	                 */
	                changed: new Signal(),

	                /**
	                 * Signal dispatched when hasher is stopped.
	                 * -  pass current hash as first parameter to listeners
	                 * @type signals.Signal
	                 */
	                stopped: new Signal(),

	                /**
	                 * Signal dispatched when hasher is initialized.
	                 * - pass current hash as first parameter to listeners.
	                 * @type signals.Signal
	                 */
	                initialized: new Signal(),

	                /**
	                 * Start listening/dispatching changes in the hash/history.
	                 * <ul>
	                 *   <li>hasher won't dispatch CHANGE events by manually typing a new value or pressing the back/forward buttons before calling this method.</li>
	                 * </ul>
	                 */
	                init: function init() {
	                    if (_isActive) return;

	                    _hash = _getWindowHash();

	                    //thought about branching/overloading hasher.init() to avoid checking multiple times but
	                    //don't think worth doing it since it probably won't be called multiple times.
	                    if (_isHashChangeSupported) {
	                        _addListener(window, 'hashchange', _checkHistory);
	                    } else {
	                        if (_isLegacyIE) {
	                            if (!_frame) {
	                                _createFrame();
	                            }
	                            _updateFrame();
	                        }
	                        _checkInterval = setInterval(_checkHistory, POOL_INTERVAL);
	                    }

	                    _isActive = true;
	                    hasher.initialized.dispatch(_trimHash(_hash));
	                },

	                /**
	                 * Stop listening/dispatching changes in the hash/history.
	                 * <ul>
	                 *   <li>hasher won't dispatch CHANGE events by manually typing a new value or pressing the back/forward buttons after calling this method, unless you call hasher.init() again.</li>
	                 *   <li>hasher will still dispatch changes made programatically by calling hasher.setHash();</li>
	                 * </ul>
	                 */
	                stop: function stop() {
	                    if (!_isActive) return;

	                    if (_isHashChangeSupported) {
	                        _removeListener(window, 'hashchange', _checkHistory);
	                    } else {
	                        clearInterval(_checkInterval);
	                        _checkInterval = null;
	                    }

	                    _isActive = false;
	                    hasher.stopped.dispatch(_trimHash(_hash));
	                },

	                /**
	                 * @return {boolean}    If hasher is listening to changes on the browser history and/or hash value.
	                 */
	                isActive: function isActive() {
	                    return _isActive;
	                },

	                /**
	                 * @return {string} Full URL.
	                 */
	                getURL: function getURL() {
	                    return window.location.href;
	                },

	                /**
	                 * @return {string} Retrieve URL without query string and hash.
	                 */
	                getBaseURL: function getBaseURL() {
	                    return hasher.getURL().replace(_baseUrlRegexp, ''); //removes everything after '?' and/or '#'
	                },

	                /**
	                 * Set Hash value, generating a new history record.
	                 * @param {...string} path    Hash value without '#'. Hasher will join
	                 * path segments using `hasher.separator` and prepend/append hash value
	                 * with `hasher.appendHash` and `hasher.prependHash`
	                 * @example hasher.setHash('lorem', 'ipsum', 'dolor') -> '#/lorem/ipsum/dolor'
	                 */
	                setHash: function setHash(path) {
	                    path = _makePath.apply(null, arguments);
	                    if (path !== _hash) {
	                        // we should store raw value
	                        _registerChange(path);
	                        if (path === _hash) {
	                            // we check if path is still === _hash to avoid error in
	                            // case of multiple consecutive redirects [issue #39]
	                            if (!hasher.raw) {
	                                path = _encodePath(path);
	                            }
	                            window.location.hash = '#' + path;
	                        }
	                    }
	                },

	                /**
	                 * Set Hash value without keeping previous hash on the history record.
	                 * Similar to calling `window.location.replace("#/hash")` but will also work on IE6-7.
	                 * @param {...string} path    Hash value without '#'. Hasher will join
	                 * path segments using `hasher.separator` and prepend/append hash value
	                 * with `hasher.appendHash` and `hasher.prependHash`
	                 * @example hasher.replaceHash('lorem', 'ipsum', 'dolor') -> '#/lorem/ipsum/dolor'
	                 */
	                replaceHash: function replaceHash(path) {
	                    path = _makePath.apply(null, arguments);
	                    if (path !== _hash) {
	                        // we should store raw value
	                        _registerChange(path, true);
	                        if (path === _hash) {
	                            // we check if path is still === _hash to avoid error in
	                            // case of multiple consecutive redirects [issue #39]
	                            if (!hasher.raw) {
	                                path = _encodePath(path);
	                            }
	                            window.location.replace('#' + path);
	                        }
	                    }
	                },

	                /**
	                 * @return {string} Hash value without '#', `hasher.appendHash` and `hasher.prependHash`.
	                 */
	                getHash: function getHash() {
	                    //didn't used actual value of the `window.location.hash` to avoid breaking the application in case `window.location.hash` isn't available and also because value should always be synched.
	                    return _trimHash(_hash);
	                },

	                /**
	                 * @return {Array.<string>} Hash value split into an Array.
	                 */
	                getHashAsArray: function getHashAsArray() {
	                    return hasher.getHash().split(hasher.separator);
	                },

	                /**
	                 * Removes all event listeners, stops hasher and destroy hasher object.
	                 * - IMPORTANT: hasher won't work after calling this method, hasher Object will be deleted.
	                 */
	                dispose: function dispose() {
	                    hasher.stop();
	                    hasher.initialized.dispose();
	                    hasher.stopped.dispose();
	                    hasher.changed.dispose();
	                    _frame = hasher = window.hasher = null;
	                },

	                /**
	                 * @return {string} A string representation of the object.
	                 */
	                toString: function toString() {
	                    return '[hasher version="' + hasher.VERSION + '" hash="' + hasher.getHash() + '"]';
	                }

	            };

	            hasher.initialized.memorize = true; //see #33

	            return hasher;
	        })(window);

	        return hasher;
	    };

	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(11)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
	        module.exports = factory(require('signals'));
	    } else {
	        /*jshint sub:true */
	        window['hasher'] = factory(window['signals']);
	    }
	})();

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	/*jslint onevar:true, undef:true, newcap:true, regexp:true, bitwise:true, maxerr:50, indent:4, white:false, nomen:false, plusplus:false */
	/*global define:false, require:false, exports:false, module:false, signals:false */

	/** @license
	 * JS Signals <http://millermedeiros.github.com/js-signals/>
	 * Released under the MIT license
	 * Author: Miller Medeiros
	 * Version: 1.0.0 - Build: 268 (2012/11/29 05:48 PM)
	 */

	(function (global) {

	    // SignalBinding -------------------------------------------------
	    //================================================================

	    /**
	     * Object that represents a binding between a Signal and a listener function.
	     * <br />- <strong>This is an internal constructor and shouldn't be called by regular users.</strong>
	     * <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
	     * @author Miller Medeiros
	     * @constructor
	     * @internal
	     * @name SignalBinding
	     * @param {Signal} signal Reference to Signal object that listener is currently bound to.
	     * @param {Function} listener Handler function bound to the signal.
	     * @param {boolean} isOnce If binding should be executed just once.
	     * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
	     * @param {Number} [priority] The priority level of the event listener. (default = 0).
	     */
	    function SignalBinding(signal, listener, isOnce, listenerContext, priority) {

	        /**
	         * Handler function bound to the signal.
	         * @type Function
	         * @private
	         */
	        this._listener = listener;

	        /**
	         * If binding should be executed just once.
	         * @type boolean
	         * @private
	         */
	        this._isOnce = isOnce;

	        /**
	         * Context on which listener will be executed (object that should represent the `this` variable inside listener function).
	         * @memberOf SignalBinding.prototype
	         * @name context
	         * @type Object|undefined|null
	         */
	        this.context = listenerContext;

	        /**
	         * Reference to Signal object that listener is currently bound to.
	         * @type Signal
	         * @private
	         */
	        this._signal = signal;

	        /**
	         * Listener priority
	         * @type Number
	         * @private
	         */
	        this._priority = priority || 0;
	    }

	    SignalBinding.prototype = {

	        /**
	         * If binding is active and should be executed.
	         * @type boolean
	         */
	        active: true,

	        /**
	         * Default parameters passed to listener during `Signal.dispatch` and `SignalBinding.execute`. (curried parameters)
	         * @type Array|null
	         */
	        params: null,

	        /**
	         * Call listener passing arbitrary parameters.
	         * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p>
	         * @param {Array} [paramsArr] Array of parameters that should be passed to the listener
	         * @return {*} Value returned by the listener.
	         */
	        execute: function execute(paramsArr) {
	            var handlerReturn, params;
	            if (this.active && !!this._listener) {
	                params = this.params ? this.params.concat(paramsArr) : paramsArr;
	                handlerReturn = this._listener.apply(this.context, params);
	                if (this._isOnce) {
	                    this.detach();
	                }
	            }
	            return handlerReturn;
	        },

	        /**
	         * Detach binding from signal.
	         * - alias to: mySignal.remove(myBinding.getListener());
	         * @return {Function|null} Handler function bound to the signal or `null` if binding was previously detached.
	         */
	        detach: function detach() {
	            return this.isBound() ? this._signal.remove(this._listener, this.context) : null;
	        },

	        /**
	         * @return {Boolean} `true` if binding is still bound to the signal and have a listener.
	         */
	        isBound: function isBound() {
	            return !!this._signal && !!this._listener;
	        },

	        /**
	         * @return {boolean} If SignalBinding will only be executed once.
	         */
	        isOnce: function isOnce() {
	            return this._isOnce;
	        },

	        /**
	         * @return {Function} Handler function bound to the signal.
	         */
	        getListener: function getListener() {
	            return this._listener;
	        },

	        /**
	         * @return {Signal} Signal that listener is currently bound to.
	         */
	        getSignal: function getSignal() {
	            return this._signal;
	        },

	        /**
	         * Delete instance properties
	         * @private
	         */
	        _destroy: function _destroy() {
	            delete this._signal;
	            delete this._listener;
	            delete this.context;
	        },

	        /**
	         * @return {string} String representation of the object.
	         */
	        toString: function toString() {
	            return '[SignalBinding isOnce:' + this._isOnce + ', isBound:' + this.isBound() + ', active:' + this.active + ']';
	        }

	    };

	    /*global SignalBinding:false*/

	    // Signal --------------------------------------------------------
	    //================================================================

	    function validateListener(listener, fnName) {
	        if (typeof listener !== 'function') {
	            throw new Error('listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName));
	        }
	    }

	    /**
	     * Custom event broadcaster
	     * <br />- inspired by Robert Penner's AS3 Signals.
	     * @name Signal
	     * @author Miller Medeiros
	     * @constructor
	     */
	    function Signal() {
	        /**
	         * @type Array.<SignalBinding>
	         * @private
	         */
	        this._bindings = [];
	        this._prevParams = null;

	        // enforce dispatch to aways work on same context (#47)
	        var self = this;
	        this.dispatch = function () {
	            Signal.prototype.dispatch.apply(self, arguments);
	        };
	    }

	    Signal.prototype = {

	        /**
	         * Signals Version Number
	         * @type String
	         * @const
	         */
	        VERSION: '1.0.0',

	        /**
	         * If Signal should keep record of previously dispatched parameters and
	         * automatically execute listener during `add()`/`addOnce()` if Signal was
	         * already dispatched before.
	         * @type boolean
	         */
	        memorize: false,

	        /**
	         * @type boolean
	         * @private
	         */
	        _shouldPropagate: true,

	        /**
	         * If Signal is active and should broadcast events.
	         * <p><strong>IMPORTANT:</strong> Setting this property during a dispatch will only affect the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
	         * @type boolean
	         */
	        active: true,

	        /**
	         * @param {Function} listener
	         * @param {boolean} isOnce
	         * @param {Object} [listenerContext]
	         * @param {Number} [priority]
	         * @return {SignalBinding}
	         * @private
	         */
	        _registerListener: function _registerListener(listener, isOnce, listenerContext, priority) {

	            var prevIndex = this._indexOfListener(listener, listenerContext),
	                binding;

	            if (prevIndex !== -1) {
	                binding = this._bindings[prevIndex];
	                if (binding.isOnce() !== isOnce) {
	                    throw new Error('You cannot add' + (isOnce ? '' : 'Once') + '() then add' + (!isOnce ? '' : 'Once') + '() the same listener without removing the relationship first.');
	                }
	            } else {
	                binding = new SignalBinding(this, listener, isOnce, listenerContext, priority);
	                this._addBinding(binding);
	            }

	            if (this.memorize && this._prevParams) {
	                binding.execute(this._prevParams);
	            }

	            return binding;
	        },

	        /**
	         * @param {SignalBinding} binding
	         * @private
	         */
	        _addBinding: function _addBinding(binding) {
	            //simplified insertion sort
	            var n = this._bindings.length;
	            do {
	                --n;
	            } while (this._bindings[n] && binding._priority <= this._bindings[n]._priority);
	            this._bindings.splice(n + 1, 0, binding);
	        },

	        /**
	         * @param {Function} listener
	         * @return {number}
	         * @private
	         */
	        _indexOfListener: function _indexOfListener(listener, context) {
	            var n = this._bindings.length,
	                cur;
	            while (n--) {
	                cur = this._bindings[n];
	                if (cur._listener === listener && cur.context === context) {
	                    return n;
	                }
	            }
	            return -1;
	        },

	        /**
	         * Check if listener was attached to Signal.
	         * @param {Function} listener
	         * @param {Object} [context]
	         * @return {boolean} if Signal has the specified listener.
	         */
	        has: function has(listener, context) {
	            return this._indexOfListener(listener, context) !== -1;
	        },

	        /**
	         * Add a listener to the signal.
	         * @param {Function} listener Signal handler function.
	         * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
	         * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
	         * @return {SignalBinding} An Object representing the binding between the Signal and listener.
	         */
	        add: function add(listener, listenerContext, priority) {
	            validateListener(listener, 'add');
	            return this._registerListener(listener, false, listenerContext, priority);
	        },

	        /**
	         * Add listener to the signal that should be removed after first execution (will be executed only once).
	         * @param {Function} listener Signal handler function.
	         * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
	         * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
	         * @return {SignalBinding} An Object representing the binding between the Signal and listener.
	         */
	        addOnce: function addOnce(listener, listenerContext, priority) {
	            validateListener(listener, 'addOnce');
	            return this._registerListener(listener, true, listenerContext, priority);
	        },

	        /**
	         * Remove a single listener from the dispatch queue.
	         * @param {Function} listener Handler function that should be removed.
	         * @param {Object} [context] Execution context (since you can add the same handler multiple times if executing in a different context).
	         * @return {Function} Listener handler function.
	         */
	        remove: function remove(listener, context) {
	            validateListener(listener, 'remove');

	            var i = this._indexOfListener(listener, context);
	            if (i !== -1) {
	                this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal
	                this._bindings.splice(i, 1);
	            }
	            return listener;
	        },

	        /**
	         * Remove all listeners from the Signal.
	         */
	        removeAll: function removeAll() {
	            var n = this._bindings.length;
	            while (n--) {
	                this._bindings[n]._destroy();
	            }
	            this._bindings.length = 0;
	        },

	        /**
	         * @return {number} Number of listeners attached to the Signal.
	         */
	        getNumListeners: function getNumListeners() {
	            return this._bindings.length;
	        },

	        /**
	         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
	         * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
	         * @see Signal.prototype.disable
	         */
	        halt: function halt() {
	            this._shouldPropagate = false;
	        },

	        /**
	         * Dispatch/Broadcast Signal to all listeners added to the queue.
	         * @param {...*} [params] Parameters that should be passed to each handler.
	         */
	        dispatch: function dispatch(params) {
	            if (!this.active) {
	                return;
	            }

	            var paramsArr = Array.prototype.slice.call(arguments),
	                n = this._bindings.length,
	                bindings;

	            if (this.memorize) {
	                this._prevParams = paramsArr;
	            }

	            if (!n) {
	                //should come after memorize
	                return;
	            }

	            bindings = this._bindings.slice(); //clone array in case add/remove items during dispatch
	            this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.

	            //execute all callbacks until end of the list or until a callback returns `false` or stops propagation
	            //reverse loop since listeners with higher priority will be added at the end of the list
	            do {
	                n--;
	            } while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
	        },

	        /**
	         * Forget memorized arguments.
	         * @see Signal.memorize
	         */
	        forget: function forget() {
	            this._prevParams = null;
	        },

	        /**
	         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
	         * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
	         */
	        dispose: function dispose() {
	            this.removeAll();
	            delete this._bindings;
	            delete this._prevParams;
	        },

	        /**
	         * @return {string} String representation of the object.
	         */
	        toString: function toString() {
	            return '[Signal active:' + this.active + ' numListeners:' + this.getNumListeners() + ']';
	        }

	    };

	    // Namespace -----------------------------------------------------
	    //================================================================

	    /**
	     * Signals namespace
	     * @namespace
	     * @name signals
	     */
	    var signals = Signal;

	    /**
	     * Custom event broadcaster
	     * @see Signal
	     */
	    // alias for backwards compatibility (see #gh-44)
	    signals.Signal = Signal;

	    //exports to multiple environments
	    if (true) {
	        //AMD
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return signals;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module !== 'undefined' && module.exports) {
	        //node
	        module.exports = signals;
	    } else {
	        //browser
	        //use string because of Google closure compiler ADVANCED_MODE
	        /*jslint sub:true */
	        global['signals'] = signals;
	    }
	})(undefined);

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(13);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(15)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./main.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./main.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(14)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function () {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(17);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(15)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./template.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./template.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(14)();
	// imports


	// module
	exports.push([module.id, "#input-form{\n    position: absolute;\n    margin: 0;\n    padding: 0;\n}\n\n#title-input{\n    position: absolute;\n    margin: 0;\n    padding: 0;\n}\n\n#image-input{\n    position: absolute;\n    margin: 0;\n    padding: 0;\n}\n\n\n#pad{\n    position: absolute;\n    margin: 0;\n    padding: 0;\n    border-top: 2px solid black;\n    overflow-y: scroll;\n}\n\n#text-area{\n    position: absolute;\n    margin: 0;\n    padding: 0;\n    width: 100%;\n    height: 100%;\n}\n\n#preview{\n    position: absolute;\n    margin: 0;\n    padding: 0;\n}\n\n#image-input{\n    position: relative;\n    margin: 0;\n    padding: 0;\n}\n\n#text-input{\n    position: relative;\n    margin: 0;\n    padding: 0;\n}\n\n#submit-button{\n    margin: 0;\n    padding: 0;\n    position: relative;\n    z-index: 1;\n}\n\n#template-list-container{\n    position: absolute;\n    margin: 0;\n    padding: 0;\n    overflow-y: scroll;\n}\n\n#save-and-delete{\n    position: absolute;\n    margin: 0;\n    padding: 0;\n}\n\ndiv{\n    margin: 0;\n    padding: 0;\n}\n\n.template-div{\n    margin: 0;\n    padding: 0;\n    position: relative;\n    width: 100%;\n}\n\nh1, h2, h3, h4, h5, h6, h7, h8{\n    margin: 0;\n    padding: 0;\n}", ""]);

	// exports


/***/ }
/******/ ]);