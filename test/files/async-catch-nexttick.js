/**
 * @example
 *
 *    throwNextTick(new Error('boom'))
 *    // async !> 'boom'
 *
 */

function throwNextTick(error) {
  process.nextTick(function() {
    throw error;
  });
}
