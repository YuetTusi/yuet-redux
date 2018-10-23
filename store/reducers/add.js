import {
    ADD
} from '../actions/action-types/add';

//累加器的state
let initState = {
    addValue: 0
};

function reducer(state = initState, action) {
    let nextState = null;

    switch (action.type) {
        case ADD:
            nextState = { ...state,
                addValue: state.addValue + action.payload
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