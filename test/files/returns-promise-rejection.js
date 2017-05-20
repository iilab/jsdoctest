var Promise = require('bluebird');

/**
 * @example
 *   rejectsAPromise() // ~!> 'Blowing-up stuff'
 */

function rejectsAPromise() {
  return new Promise(function(resolve, reject) {
    reject(new Error('Blowing-up stuff'));
  });
}
