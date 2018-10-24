import {
    compose
} from './compose';

/**
 * 装载中间件
 * @param {Function} middlewares 中间件集合
 */
function applyMiddleware(...middlewares) {
    return function (createStore) {
        return function (reducer) {
            let store = createStore(reducer);
            //调用中间件，返回新dispatch方法
            // let newDispatch = middlewares(store)(store.dispatch);

            //一次传入多个中间件，循环包开一层函数
            let chain = middlewares.map(middleware => {
                return middleware(store);
            });

            let composed = compose(...chain);

            let newDispatch = composed(store.dispatch); //dispatch方法传给第一个执行中间件
            //覆盖原有的dispatch方法
            return {
                ...store,
                dispatch: newDispatch
            }
        }
    }
}
export default applyMiddleware;