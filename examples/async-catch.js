/**
 * @example
 *
 *    takesCallbackThrows('something', cb)
 *    // async !> 'bad things happen'
 *
 */
function takesCallbackThrows(something, cb) {
  new Error('bad things happen');
  cb();
}
