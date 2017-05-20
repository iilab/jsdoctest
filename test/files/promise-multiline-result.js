/**
 * @example
 *
 *  createResource().then(() => {
 *    return { a: 1, b: 'something else'}
 *  });
 *  // ~> {
 *  //   a: 1,
 *  //   b: 'something else'
 *  // }
 *
 *  createResource().then(() => {
 *    return { a: 1, b: 'https://yo.org'}
 *  });
 *  // ~> {
 *  //   "a": 1,
 *  //   "b": 'https://yo.org'
 *  // }
 *
 */

function createResource() {
  return new Promise(resolve => {
    resolve('something');
  });
}
