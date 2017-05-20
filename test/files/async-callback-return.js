/**
 * @example
 *
 *    takesCallbackReturnsError('something', cb)
 *    // async !> 'bad things happen'
 *
 */

function takesCallbackReturnsError(something, cb) {
  cb(new Error('bad things happen'));
  return;
}
