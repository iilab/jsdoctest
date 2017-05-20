/**
 * @example
 *
 *    takesCallbackThrows('something', cb)
 *    // async !> 'whatever'
 *
 */

function takesCallbackThrows(something, cb) {
  throw new Error('bad things happen');
  cb();
}
