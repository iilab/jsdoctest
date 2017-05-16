if (typeof describe != undefined) var assert = require('assert');

/**
 * @example
 *
 *  createResource().then(() => {
 *    return { a: 1, b: 'something else'}
 *  });
 *  // async => {
 *  //   a: 1,
 *  //   b: 'something else'
 *  // }
 *
 *  createResource().then(() => {
 *    return { a: 1, b: 'https://yo.org'}
 *  });
 *  // async => {
 *  //   "a": 1,
 *  //   "b": 'https://yo.org'
 *  // }
 *
 */

function createResource() {
  return new Promise((resolve) => {
    resolve('something');
  });
}
