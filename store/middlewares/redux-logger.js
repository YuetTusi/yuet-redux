/**
 * 日志中间件
 * @param {Object} store 仓库 
 */
function reduxLogger(store) {
    return function (dispatch) {
        return function (action) {
            console.log(`更新前：${JSON.stringify(store.getState())}`);
            dispatch(action);
            console.log(`更新后：${JSON.stringify(store.getState())}`);
        }
    }
}

export {
    reduxLogger
};