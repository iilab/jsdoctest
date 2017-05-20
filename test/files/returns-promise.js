var Promise = require('bluebird');

/**
 * @example
 *   resolvesAPromise() // ~> 10
 */

function resolvesAPromise() {
  return new Promise(function(resolve) {
    resolve(10);
  });
}
