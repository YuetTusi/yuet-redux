function reduxInfo(store) {
    return function (dispatch) {
        return function (action) {
            console.log('输出消息从info中间件...');
            dispatch(action);
        }
    }
}

export {
    reduxInfo
};