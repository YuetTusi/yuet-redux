function createStore(reducer) {

  var currentState;
  var isDispatching = false;
  var currentReducer = reducer;
  var listeners = [];

  /**
   * 得到前端状态
   */
  function getState() {
    return currentState;
  }

  /**
   * 派发动作
   * @param {Object} action Action对象 
   */
  function dispatch(action) {

    if (typeof action.type === 'undefined') {
      throw new Error('Action 不合法');
    }
    if (isDispatching) {
      throw new Error('当前状态正在分发...');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
      listeners.forEach(fn => fn());
    } finally {
      isDispatching = false;
    }
  }

  /**
   * 订阅
   * @param {Function} listener 监听函数
   * @returns {Function} 返回退订函数
   */
  function subscribe(listener) {
    listeners.push(listener);
    return function () {
      listeners.filter(fn => fn != listener);
    }
  }

  //执行一次派发，以保证state初始化
  dispatch({
    type: '@@redux/INIT'
  });

  return {
    getState,
    dispatch,
    subscribe
  }
}

export {
  createStore
}