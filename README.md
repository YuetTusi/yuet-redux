# 面试还问redux？那我从头手撸源码吧（一）

最近处在项目的间歇期，没事参加了几场面试发现面试官依然喜欢问redux的一些问题，尤其是问这种开发框架的问题最好的办法就是撤底搞懂其源码，正好利用这两天时间从头过了一遍redux库，还是有些收获的。

redux源码我大致分了3块，从易到难：

- 状态管理核心代码
- react-redux库
- 中间件

手写源码不是目的，主要是为了看看大牛写的代码更能开拓思维，以后和面试官扯淡的时候能把他忽悠住。
下面从零开始，手撸一套自己的redux库，预期与官方库达到近似的功能，并且比较官方源码，看看自己的写法有哪些不足。下面先从redux核心代码开始。

## redux核心代码实现

动手之前先回顾一下redux是干什么的，它能解决什么问题？redux的出现就是为了解决react组件的状态管理。redux内部管理了一个状态树（state），根据开发者提供的reducer来“派发”一个“动作”以更新state，这样数据管理全部交由redux来处理而不在由react组件去操心。其实redux只是一种数据管理的设计思想，而不是一个用于react中的特定框架，因此只要我们的业务足够复杂，脱离react在任何环境下都能使用redux。

![redux流程图]()

redux核心具有以下功能：

- 得到当前状态（getState）
- 订阅（subscribe）与退订
- 派发动作以更新状态（dispatch）
- 生成actionCreator
- 合并reducer

我们一一实现这些功能。

### 代码基本结构

redux的核心即状态管理，一个数据仓库中维护了一个状态树，我们要向开发者提供一个访问状态（state）的接口，我们写出它的基本结构：
```javascript
function createStore(reducer) {

  var currentState; //状态
  var currentReducer = reducer; //外界提供的reducer

  /**
   * 暴露给开发者，得到当前状态
   */
  function getState() {
    return currentState;
  }

  return {
    getState
  }
}

export {
  createStore
}
```

可以看到代码非常简单，createStore函数接收一个reducer，因为具体更新state的逻辑是由开发者提供的，因此站在redux设计者的角度上，我只接收你给我的“逻辑”，而更新后的状态封装在内部currentState对象中，并提供一个访问此对象的接口函数，这样就通过闭包的方式保护好了内部的状态。

### 派发功能的实现

redux架构中更新状态的方式只有一个，那就是派发（dispatch）一个动作（action），不可以由开发者手动修改内部state对象，因此我们还要提供一个dispatch方法，使其具有更新状态的功能。

```javascript
function createStore(reducer) {

  var currentState; //状态
  var currentReducer = reducer; //外界提供的reducer
  /**
   * 派发动作
   * @param {Object} action Action对象 
   */
  function dispatch(action) {

      currentState = currentReducer(currentState, action);
  }
  //其他代码略...
}
```
以上就实现了派发功能，只此一条语句，调用开发者提供的reducer函数，并传入action动作对象，即将更新后的新state覆盖了旧对象。

但是只此一条语句显然不够严谨，我们把代码写得更健壮一些，如果传入的action对象不合法（比如没有type属性）我们的代码是会出现错误。

```javascript
function createStore(reducer) {

  var currentState;
  var currentReducer = reducer;
  var isDispatching = true; //正在派发标记
  /**
   * 派发动作
   * @param {Object} action Action对象 
   */
  function dispatch(action) {
    //验证action对象合法性
    if (typeof action.type === 'undefined') {
      throw new Error('Action 不合法');
    }
    if (isDispatching) {
      throw new Error('当前状态正在分发...');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
  }
  //其他代码略...
}
```

官方源码中还加入了一个“正在派发”的标志，若当前redux调用栈正处于派发当中，也会抛出错误，至此，redux库中最核心的派发功能已经实现。

插一句，在redux库中默认调用了一次dispatch方法，为什么要先调用一次呢？因为缺省状态下，内部的currentState对象为`undefined`，为了保证状态已赋初始值，我们要手动调用一下dispatch方法（因为初始化状态是由外界提供），并传入一个初始化动作：
```javascript
  //执行一次派发，以保证state初始化
  dispatch({
    type: '@@redux/INIT'
  });
```
`@@redux/INIT`这个动作本无实际意义，其目的就是为了初始化状态对象，为什么叫这个名字呢？我理解只是想起个逼格高点的名字。

### 订阅与退订

当状态树更新，随之可能要做一些后续操作，比如Web开发中要更新对应的视图，而让开发者自己调用显然不是一个友好的做法，因此我们可以参照“发布－订阅”模式来实现订阅功能。

方法很简单，使用一个数组记录下订阅的函数，当派发动作完成，即按顺序执行“订阅”即可：


```javascript
function createStore(reducer) {

  var listeners = []; //保存订阅回调

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

  //其它代码略...
}
```

subscribe方法是一个高阶函数，传入了外界的订阅回调，并追加到listener数组中，返回的仍是一个函数，即退订。

这样再次执行退订函数即过滤掉了当前回调，完成了退订操作，这就是使用“发布－订阅”模式的实现。

最后，别忘了在dispatch方法中调用订阅函数：
```javascript
listeners.forEach(fn => fn());
```

### 生成actionCreator

回顾一下在使用redux开发的过程中，我们一般都使用一个函数来返回action对象，这样做的好处是避免手写长长的ActionType，免得出错：

```javascript
//ActionCreator例子：
function displayBook(payload){
    return {type:'DISPLAY_BOOK', payload};
}
```
这样通过调用函数的方式`displayBook(1001)`就返回了相应的action对象。接下来派发即可：`store.dispatch(displayBook(1001))`

而得到了action之后的工作就是派发，每次如果都手动调用`store.dispatch()`显得很冗余，因此redux提供了bindActionCreator方法，它的功能就是将dispatch功能封装到actionCreator函数里，可以让开发者节省一步调用dispatch的操作，我们实现它。

新建一个bindActionCreators.js文件，我们写出函数签名：
```javascript
/**
 * 创建ActionCreators
 * 将派发动作封装到原actionCreator对象里面
 * @param {Object} actionCreators 对象集合
 * @param {Function} dispatch redux派发方法 
 */
function bindActionCreators(actionCreators, dispatch) {

}
```
可以看到传入的是一个由每个actionCratore封装好的对象，其原理非常简单，循环对象中每一个actionCreator方法，将dispatch方法的调用重写到新函数里即可：

```javascript
function bindActionCreators(actionCreators, dispatch) {

    var boundActions = {};
    Object.keys(actionCreators).forEach(key => {
        //将每个actionCreator重写
        boundActions[key] = function (...args) {
            //将派发方法封装到新函数里
            dispatch(actionCreators[key](...args));
        };
    });
    return boundActions;
}
```
经过bindActionCreator的处理之后，可以将代码进一步精简：
```javascript
var actionCreator = bindActionCreators({displayBook},store.dispatch);
```
直接调用
`actionCreator.displayBook(1001)`即派发了DISPLAY_BOOK动作。

### 合并reducer

随着redux项目的越来越复杂，reducer的业务逻辑也越来越多，如果将所有的业务都放在一个reducer函数中显然很拙劣，通常我们使用react结合redux开发时，reducer与组件相对应，因此按组件功能来拆分reducer会更好的管理代码。

redux提供了combineReducers来实现将多个reducer合并为一个，我们先来回顾一下它的用法：

```javascript
import { combineReducers } from 'redux';

const chatReducer = combineReducers({
  chatLog,
  statusMessage,
  userName
})
//chatReducer函数即合并后的reducer
```

可以看到它的用法和之前的bindActionCreators类似，仍是将每个reducer封装为一个对象传入，返回的结果即合并后的reducer。

使用时需注意的是，combineReducers以reducer的名称来合并为一个最终的大state对象：

![reducers]()

创建一个combineReducers.js，来实现合并reducer方法：

```javascript
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
```

可见，原理和同样是循环对象中的每一个reducer，使用reducer名称来合并为最终的reducer函数。

这样高阶函数返回的方法一定要按照reducer的名称来分类即可。

至此redux库的核心代码已经实现完毕。等抽出时间再总结一下react-redux库及中间件的源码。




## 中间件

react中管理数据的流程是单向的，就是说，从派发动作一直到发布订阅触发渲染是一条路走到头，那么如果想要在中间添加或是更改某个逻辑就需要找到action或是reducer来修改，有没有更方便的做法呢？

而中间件（middleware）就是一个可插拔的机制，如果想找扩展某个功能，比如添加日志，在更新前后打印出state状态，只需要将日志中间件装到redux上即可，于是便有了日志功能，当不想使用时可再拿掉，非常方便。


目前有很多第三方的中间件安装即可使用，比如刚刚提及的日志中间件：redux-logger，使用npm安装它：

```npm install redux-logger```

redux包提供了一个方法可以装载中间件：applyMiddleware。在创建store对象的时候，可以传入第二个参数，它就是中间件：


```javascript
import { createStore, applyMiddleware } from "redux";
import { reducer } from "./reducer";
import ReduxLogger from "redux-logger";
//使用applyMiddleware加载中间件
let store = createStore(reducer, applyMiddleware(ReduxLogger));
```

装载好中间件就在派发动作上扩展了相应的功能，这时我们正常编写redux程序，当执行dispatch方法时会在控制台打印出state更新日志：

![logger](https://user-gold-cdn.xitu.io/2018/8/10/1651f784215cfca2?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

以上就是一个使用中间件的例子。

### 浅析中间件的原理

那么中间件的执行原理是什么呢？就用刚刚的日志中间件举例，它的功能是在state对象的更新前后分别输出状态，那么肯定是在派发（dispatch）动作的那一刻去实现的，那我们改写一下redux库，将“打印日志”功能添加到dispatch方法里：

```javascript
let temp = store.dispatch;//暂存原dispatch方法
store.dispatch = function(action) {
  console.log("旧state：", store.getState());
  temp(action);//执行原dispatch方法
  console.log("新state：", store.getState());
};
```
这样就实现了“日志中间件”，但是直接改写redux库是不可能的，我们需要一个通用的办法去定义中间件，redux提供了这样一个方法：**applyMiddleware**。

它的使用方法很简单，将需要加载的中间件依次传入applyMiddleware方法中即可：

```applyMiddleware(ReduxLogger, ReduxThunk);```

### 手写applyMiddleware源码

中间件原理我们分析完了，即然中间件就是扩展dispatch方法，那么applyMiddlware必然会将中间件的dispatch方法和原始dispatch传入才可行，没错，我们就看看它的方法签名：

```javascript 
var applyMiddleware = (middlewares) => (createStore) => (reducer) => {};
```

以上就是applyMiddleware方法，它又是一个三层的高阶函数，这里用到了函数柯里化的思想，将多个参数拆分为单一参数的高阶函数，以保证每一层只有一个参数，这样更加灵活可分块调用。写成箭头函数不好理解，我们改写为普通函数形式：

```javascript
var applyMiddleware = function (middlewares){
  return function (createStore){
    return function (reducer){
      //在这里装载中间件
    }
  }
};
```

通过函数参数就可以看到，三层函数分别传入了中间件（middleware）、创建仓库方法（createStore）和reducer函数，这正是我们装载一个中间件所需要的。

接下来我们的目标就是将中间件提供的dispatch覆盖redux原有的dispatch方法，这样就“装载”好了中间件。


```javascript
var applyMiddleware = function (middlewares) {
    return function (createStore) {
        return function (reducer) {
            let store = createStore(reducer);
            //调用中间件，返回新dispatch方法
            let newDispatch = middlewares(store)(store.dispatch);
            //覆盖原有的dispatch方法并返回仓库对象
            return {
                ...store,
                dispatch: newDispatch
            }
        }
    }
}
```
有了通用写法，我们自己模拟实现一个日志中间件：
```javascript
function reduxLogger(store) {
    return function (dispatch) {
        //dispatch参数即原redux派发方法
        return function (action) {
            //返回的这个函数即新方法
            //最终会传入applyMiddleware覆盖掉dispatch
            console.log(`更新前：${JSON.stringify(store.getState())}`);
            dispatch(action);
            console.log(`更新后：${JSON.stringify(store.getState())}`);
        }
    }
}
```

调用我们自己的方法装载中间件：`applyMiddleware(reduxLogger);`，运行效果如下：

![](2018-10-23_15-10-01.png)

### 组合中间件

但是到现在还没完，还记得官方redux库吗？人家的applyMiddlewares方法是支持传入多个中间件的，如：`applyMiddlewares(middleware1,middleware2);` 我们目前的方法还不支持这种写法，最终的目的是想把若干个中间件一次组合为一个整体，一起加载。

#### 洋葱模型

洋葱模型的概念似乎是在Koa2框架中提出的，它是指中间件的执行机制，当多个中间件执行时，后一个中间件会套在前一个中间件的里面：

![]()

执行完一个中间件会一直向里走，直到最后一个执行结束，再从内而外走出，就像是在剥洋葱一样。

#### compose方法

我们同样使用洋葱模型来写一个组合方法，以达到目的。

新建一个compose.js，创建一个组合函数：
```javascript
/**
 * 组合所有中间件
 * @param  {...any} middlewares 
 */
function compose(...middlewares) {
    return function (...args) {

    }
}
```

我的目标是当调用组合函数，传入多个中间件，将所有的中间件组合成一个函数：
```javascript
var all = compose(middleware3, middleware2, middleware1);
all();//调用时，依次执行所有中间件
```
我们动手实现它：
