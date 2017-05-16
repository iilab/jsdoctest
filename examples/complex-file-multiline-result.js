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
 */

function createResource() {
  return new Promise((resolve) => {
    resolve('something');
  });
}
