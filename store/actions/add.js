import {
  ADD
} from './action-types/add';

let actionCreators = {
  add: function (payload) {
    return {
      type: ADD,
      payload
    };
  }
};

export default actionCreators;