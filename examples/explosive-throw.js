require('should');
const Module = require('module');
try {
  should.fail();
} catch (e) {
  // Hack to swallow stack trace.
  Error.captureStackTrace(e, Module);
  throw 'explode!';
}
