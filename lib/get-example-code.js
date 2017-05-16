'use strict';

module.exports = exports = getExampleCode;

/**
 * Compiles down an `example`. Async examples call an imaginary `done` function
 * once they're done.
 *
 * @param {Object} comment
 * @param {String} comment.testCase
 * @param {String} comment.expectedResult
 * @param {Boolean} comment.isAsync
 * @return {String}
 */

function getExampleCode(comment) {
  var expectedResult = comment.expectedResult;
  var isAsync = comment.isAsync;
  var isAsyncError = comment.isAsyncError;
  var testCase = comment.testCase;

  if (isAsync) {
    return (
      // '\nconsole.trace();console.log("arguments.callee", arguments.callee.callee);' +
      '\nfunction cb(err, result) {' +
      // 'console.log(JSON.stringify(result.should.eql,true,2)); ' +
      // 'Error.captureStackTrace(result); ' +
      'if(err) { return done(err);}' +
      'result.should.eql(' +
      expectedResult +
      ');' +
      'done();' +
      '};' +
      'var returnValue = ' +
      testCase +
      ';' +
      "if(returnValue && returnValue.then && typeof returnValue.then === 'function') {" +
      'return returnValue.then(cb.bind(null, null), cb);' +
      '}'
    );
  } else if (isAsyncError) {
    return (
      '\nfunction cb(err, result) {' +
      '  if(err && err.message === ' +
      expectedResult +
      ') return done();' +
      // '  var mod = module;' +
      // '  console.log(mod);' +
      '  var e = new Error("Expected AsyncError: \\n\\t' +
      expectedResult.replace(/\"/g, '') +
      '\\n\\t but got: \\n\\t\\t" + err.message );' +
      '  Error.captureStackTrace(e, cb);' +
      '  done(e);' +
      '};' +
      'try {' +
      'var returnValue = ' +
      testCase +
      ';' +
      "if(returnValue && returnValue.then && typeof returnValue.then === 'function') {" +
      'return returnValue.then(cb.bind(null, null), cb);' +
      '}' +
      '} catch(e) { console.log("caught"); e.should.throw(' +
      expectedResult.split(':').join(',') +
      '); done(e)}'
    );
    // return (
    //   '\nfunction cb(err, result) {' +
    //   'err.should.eql(' +
    //   expectedResult +
    //   ');' +
    //   'done();' +
    //   '};' +
    //   '  try {' +
    //   'var returnValue = ' +
    //   testCase +
    //   '.should.Throwl( ' +
    //   expectedResult.split(':').join(',') +
    //   '  );' +
    //   '    done();' +
    //   '  } catch( e ) {' +
    //   '    e.should.eql(' +
    //   expectedResult.split(':').join(',') +
    //   ');' +
    //   '};' +
    //   "if(returnValue && returnValue.then && typeof returnValue.then === 'function') {" +
    //   'return returnValue.then(cb.bind(null, null), cb);' +
    //   '}'
    // );
  } else {
    return '(' + testCase + ').should.eql(' + expectedResult + ');';
  }
}

/**
 * Escapes a string for meta-quoting
 */

function escapeString(str) {
  return str.replace(/\\/g, '\\\\').replace(/\'/g, "\\'");
}

exports.escapeString = escapeString;
