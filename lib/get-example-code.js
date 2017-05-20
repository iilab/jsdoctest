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
  var isPromise = comment.isPromise;
  var isPromiseRejection = comment.isPromiseRejection;
  var isAsyncError = comment.isAsyncError;
  var testCase = comment.testCase;

  if (isAsync) {
    return (
      '\nvar returnError,returnValue;' +
      'function cb(err, result) {' +
      // '  console.log("AsyncError.incallback");' +
      // '  console.log("AsyncError.incallback.err", err);' +
      // '  console.log("AsyncError.incallback.result", result);' +
      '  result.should.eql(' +
      expectedResult +
      '  );' +
      'done()' +
      '};' +
      'function returnFunction() { ' +
      testCase +
      '};' +
      'returnFunction.should.not.Throw();'
    );
  } else if (isAsyncError) {
    return (
      '\nvar returnError,returnValue;' +
      'function cb(err, result) {' +
      // '  console.log("AsyncError.incallback");' +
      // '  console.log("AsyncError.incallback.err", err);' +
      // '  console.log("AsyncError.incallback.result", result);' +
      '  err.should.be.an("error");' +
      '  err.should.have.property("message").and.have.string(' +
      expectedResult +
      '  );' +
      'done()' +
      '};' +
      'function returnFunction() { ' +
      testCase +
      '};' +
      'returnFunction.should.not.Throw();'
      // 'returnFunction();'
    );
  } else if (isPromise) {
    const promiseCode =
      // // '\nconsole.trace();console.log("arguments.callee", arguments.callee.callee);' +
      // '\nfunction cb(err, result) {' +
      // // 'console.log(JSON.stringify(result.should.eql,true,2)); ' +
      // // 'Error.captureStackTrace(result); ' +
      // 'if(err) { return done(err);}' +
      // 'console.log(JSON.stringify(result,true,2)); ' +
      // 'result.should.eql();' +
      // 'done();' +
      // '};' +
      'var returnValue = ' +
      testCase +
      ';' +
      // '.catch(done);' +
      "if(returnValue && returnValue.then && typeof returnValue.then === 'function') {" +
      // 'console.log(returnValue); ' +
      'return returnValue.should.be.fulfilled.and.eventually.deep.equal(' +
      expectedResult +
      ');' +
      // 'done();' +
      '} else { ' +
      // 'done(new Error("Doctest return value is not a Promise. ~> notation expects a Promise but got : " + typeof returnValue + " / " + returnValue))' +
      'new Error("Doctest return value is not a Promise. ~> notation expects a Promise but got : " + typeof returnValue + " / " + returnValue)' +
      '}';
    return promiseCode;
  } else if (isPromiseRejection) {
    const promiseRejectCode =
      // // '\nconsole.trace();console.log("arguments.callee", arguments.callee.callee);' +
      // '\nfunction cb(err, result) {' +
      // // 'console.log(JSON.stringify(result.should.eql,true,2)); ' +
      // // 'Error.captureStackTrace(result); ' +
      // 'if(err) { return done(err);}' +
      // 'console.log(JSON.stringify(result,true,2)); ' +
      // 'result.should.eql();' +
      // 'done();' +
      // '};' +
      'var returnValue = ' +
      testCase +
      ';' +
      // '.catch(done);' +
      // 'console.log(process.cwd());' +
      "if(returnValue && returnValue.then && typeof returnValue.then === 'function') {" +
      // 'console.log(returnValue); ' +
      'return returnValue.should.be.rejectedWith(Error, ' +
      expectedResult +
      ');' +
      // 'done();' +
      '} else { ' +
      // 'done(new Error("Doctest return value is not a Promise. ~> notation expects a Promise but got : " + typeof returnValue + " / " + returnValue))' +
      'new Error("Doctest return value is not a Promise. ~!> notation expects a Promise but got : " + typeof returnValue + " / " + returnValue)' +
      '}';
    return promiseRejectCode;
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
