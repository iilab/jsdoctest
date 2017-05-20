/**
 * @example
 *
 *    takesCallbackReturnsError('something', cb)
 *    // async !> 'good things happen'
 *
 */

function takesCallbackReturnsError(something, cb) {
  cb(new Error('bad things happen'));
}
