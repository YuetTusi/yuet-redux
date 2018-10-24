import {
  createStore,
  applyMiddlewares
} from '../redux';
import reducer from './reducers';

import {
  reduxLogger
} from './middlewares/redux-logger';
import {
  reduxInfo
} from './middlewares/redux-info';

// console.log(reducer);

let store = createStore(reducer, applyMiddlewares(reduxLogger, reduxInfo));
window._store = store;

export {
  store,
  reducer
};