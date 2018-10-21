import {
  ADD,
  MINUS
} from './action-types/counter';

let actionCreators = {
  add: function (payload) {
    return {
      type: ADD,
      payload
    };
  },
  minus: function (payload) {
    return {
      type: MINUS,
      payload
    };
  }
};

export default actionCreators;