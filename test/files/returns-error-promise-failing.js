var Promise = require('bluebird');

/**
 * @example
 *   rejectsAPromise()
 *    // ~!> 10
 */

function rejectsAPromise() {
  return new Promise(function(resolve, reject) {
    reject(new Error('boom'));
  });
}
