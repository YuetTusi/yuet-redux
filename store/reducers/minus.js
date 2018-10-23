import {
    MINUS
} from '../actions/action-types/minus';

//递减器的state
let initState = {
    minusValue: 0
};

function reducer(state = initState, action) {
    let nextState = null;

    switch (action.type) {
        case MINUS:
            nextState = { ...state,
                minusValue: state.minusValue - action.payload
            };
            break;
        default:
            nextState = {
                ...state
            };
            break;
    }
    return nextState;
}

export default reducer;