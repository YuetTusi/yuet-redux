import {
    combineReducers
} from '../../redux';

import add from './add';
import minus from './minus';

//导出合并后的reducer
export default combineReducers({
    add,
    minus
});