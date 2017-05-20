var Promise = require('bluebird');

/**
 * @example
 *   rejectsAPromise()
 *    // ~!> "boom"
 */

function rejectsAPromise() {
  return new Promise(function(resolve, reject) {
    reject(new Error('boom'));
  });
}
