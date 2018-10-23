import {
    MINUS
} from './action-types/minus';

let actionCreator = {
    minus: function (payload) {
        return {
            type: MINUS,
            payload
        };
    }
};

export default actionCreator;