/**
 * @example
 *   resolvesAPromise()
 *    .then(() => resolvesAPromise())
 *    // ~> 10
 */

function resolvesAPromise() {
  return new Promise(function(resolve) {
    resolve(10);
  });
}
