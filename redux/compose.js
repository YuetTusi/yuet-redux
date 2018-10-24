/**
 * 组合所有中间件
 * @param  {...any} middlewares 
 */
// function compose(...middlewares) {
//   //args即第一个中间件所需参数
//   return function (...args) {
//     return middlewares.reduce((composed, current) => {

//       return function (...args) {
//         //当前中间件的执行结果即上一个中间件的参数
//         return composed(current(...args));
//       }
//     })(...args);
//   }
// }

/**
 * 组合所有中间件(箭头函数写法)
 * @param  {...any} middlewares 
 */
function compose(...middlewares) {
  return (...args) => middlewares.reduce((composed, current) => (...args) => composed(current(...args)))(...args)
}


export {
  compose
};