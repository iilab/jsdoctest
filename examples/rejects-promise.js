var Promise = require('bluebird');

/**
 * @example
 *   rejectsAPromise() // async => 'doesn\'t matter'
 */

function rejectsAPromise() {
  return new Promise(function(resolve, reject) {
    reject(new Error('Blowing-up stuff'));
  });
}
