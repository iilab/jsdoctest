/**
 * @example
 *   createResource();
 *   // async => 'something'
 *
 *   createResource().then(() => {
 *     return 'something else'
 *   });
 *   // async => 'something else'
 *
 */

function createResource() {
  return new Promise((resolve) => {
    resolve('something');
  });
}
