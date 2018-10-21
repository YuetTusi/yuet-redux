/**
 * 创建ActionCreators
 * 将派发动作封装到原actionCreator对象里面
 * @param {Object} actionCreators 对象集合
 * @param {Function} dispatch redux派发方法 
 */
function bindActionCreators(actionCreators, dispatch) {

    //若传入的是个函数，则按一个actionCreator处理
    if (typeof (actionCreators) === 'function') {
        return bindActionCreator(actionCreators, dispatch);
    }
    if (typeof actionCreators !== 'object' || actionCreators === null) {
        throw new Error('ActionCreator不合法，请检查参数');
    }

    var boundActions = {};
    Object.keys(actionCreators).forEach(key => {
        boundActions[key] = function (...args) {
            dispatch(actionCreators[key](...args));
        };
    });
    return boundActions;
}

/**
 * 创建ActionCreators
 * 将派发动作封装到原actionCreator对象里面
 * @param {Function} actionCreator 单个actionCreator
 * @param {Function} dispatch redux派发方法 
 */
function bindActionCreator(actionCreator, dispatch) {
    return function (...args) {
        dispatch(actionCreator.apply(this, args));

    }
}

export default bindActionCreators;

/*
在调用bindActionCreators之前：
{
    add:function(payload){
        return {type:'ADD',payload};
    }
}
在调用bindActionCreators之后，将dispatch动作封装在了里面：
{
    add:function(payload){
        store.dispatch({type:'ADD',payload});
    }
}

*/