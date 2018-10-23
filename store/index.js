import {
  createStore
} from '../redux';
import reducer from './reducers';

// console.log(reducer);

let store = createStore(reducer);
window._store = store;

export {
  store,
  reducer
};