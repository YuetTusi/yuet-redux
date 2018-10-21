import {
  add,
  minus
} from '../actions/counter';
import {
  ADD,
  MINUS
} from '../actions/action-types/counter';

let initState = {
  number: 0
};

function reducer(state = initState, action) {
  let nextState = null;

  switch (action.type) {
    case ADD:
      nextState = {
        ...state,
        number: state.number + action.payload
      }
      break;
    case MINUS:
      nextState = {
        ...state,
        number: state.number - action.payload
      }
      break;
    default:
      nextState = state;
      break;
  }

  return nextState;
}

export default reducer;