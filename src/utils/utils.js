// A simple wrapper function to render and avoid having multiple
// functions calling the same render method.
// Takes as argument the function to be rendered, the callbackFn to be executed
// before and N arguments of the callbackFn.
const reRender = (renderFn, callback, ...args) => {
  callback(...args);
  renderFn();
}
