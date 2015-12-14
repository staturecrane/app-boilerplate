import {Dominator, Store} from '../../public/js/vendor/dominator.js';

let store = new Store;

let dominate = new Dominator(store);

export {store, dominate};