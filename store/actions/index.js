import add from './add';
import minus from './minus';

import {
    bindActionCreators
} from '../../redux';
import {store} from '../../store';

let actionCreators = {
    ...add,
    ...minus
}

export default bindActionCreators(actionCreators, store.dispatch);