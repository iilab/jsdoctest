if (typeof describe != undefined) var assert = require('assert');

/**
 * @example
 *   createResource();
 *   // ~> 'something'
 *
 *   createResource().then(() => {
 *     return 'something else'
 *   });
 *   // ~> 'something else'
 *
 *   createResource()
 *     .then(function(ret) {
 *       assert(ret === 'something');
 *       return 'something else'
 *     });
 *   // ~> 'something else'
 */

function createResource() {
  return new Promise(resolve => {
    resolve('something');
  });
}
