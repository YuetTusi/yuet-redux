import {
  createStore
} from '../redux';
import counterReducer from './reducers/counter';

let store = createStore(counterReducer);
window._store = store;

export {
  store
};