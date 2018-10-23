/**
 * 合并reducer
 * @param {Object} reducers reducer集合
 * @returns {Function} 整合后的reducer
 */
function combineReducers(reducers) {
    return function (state = {}, action) {
        let combinedState = {}; //合成后的state对象
        Object.keys(reducers).forEach(name => {
            //执行每一个reducer，将返回的state挂到 combinedState中，并以reducer的名字命名
            combinedState[name] = reducers[name](state[name], action);
        });
        return combinedState;
    }
}

export default combineReducers;


/**
 * 设计combineReducers的目的就是用于拆分reducer，在一个较大的项目中不可能将所有的逻辑都
 * 封装在一个reducer中，这样会使reducer函数异常庞大。因此使用combineReducers函数将一个个
 * 小的reducer组合成一个大的reducer，注意的是它们之间是按照reducer的名字来做区分，比如：
 * reducerA(){}
 * reducerB(){}
 * reducerC(){}
 * 以上有三个reducer函数，在使用combineReducers合成之后会以各个reducer名称来合成为一个大
 * 的reducer函数：
 * let reducer = combineReducers({
 *  reducerA,reducerB,reducerC
 * });
 * 返回的结果仍是一个函数
 * reducer(state.reducerA,action);
 */