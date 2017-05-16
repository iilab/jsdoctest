'use strict';
var UglifyJS = require('uglify-js');
var util = require('./util');

/**
 * Parses doctest examples from a string.
 *
 * @param {String} input
 * @return {Array} examples
 */

exports.run = function commentParser$run(input) {
  return exports.parseExamples(exports.parseComments(input));
};

/**
 * Parses comments and code from a string. Heavily inspired by the code in @tj's
 * `dox` module
 *
 * @param {String} input
 * @return {Array} parsed
 */

exports.parseComments = function commentParser$parseComments(input) {
  input = input.replace(/\r\n/gm, '\n');
  var nodes = [];

  var insideSinglelineComment = false;
  var insideMultilineComment = false;
  var insideMultiSinglelineComment = false;
  var insideMultiSingleMaybe = false;
  var removeTrailingSpaces = false;
  var pastfirstDoubleSlash = false;


  var currentNode = { type: 'code', string: '' };

  for (var i = 0, len = input.length; i < len; i += 1) {
    // console.log('i',i)
    // console.log('currentNode.string',currentNode.string)
    // insideSinglelineComment && console.log('insideSinglelineComment')
    // insideMultiSinglelineComment && console.log('insideMultiSinglelineComment')
    // insideMultiSingleMaybe && console.log('insideMultiSingleMaybe')
    // pastfirstDoubleSlash && console.log('pastfirstDoubleSlash')
    if (insideMultilineComment) {
      if (input[i] === '*' && input[i + 1] === '/') {
        flush();
        insideMultilineComment = false;
        i += 1;
        continue;
      }
    } else if (insideSinglelineComment) {
      if (input[i] === '\n' && input[i+1] !== '/' && input[i+1] !== ' ') {
        // console.log('input[i+1]', input[i+1])
        // console.log('input >>>', input[i-2] + input[i-1] + input[i] + input[i+1] + input[i+2])
        // console.log('END OF SINGLE - parsed newline and nextline not a comment this was a singleline comment and we flush')
        flush();
        insideSinglelineComment = false;
        continue;
      } else if (input[i] === '\n' && input[i+1] === '/'  && input[i+2] === '/' ) {
        // console.log('SINGLE IS MULTI - parsed newline and another single line comment so this is a multi single line comment')
        insideSinglelineComment = false;
        insideMultiSinglelineComment = true;
        continue;
      } else if (input[i] === '\n' && input[i+1] === ' ') {
        // console.log('MULTISINGLE MAYBE?')
        insideSinglelineComment = false;
        insideMultiSingleMaybe = true;
        continue;
      }
    } else if (insideMultiSinglelineComment) {
      if (!pastfirstDoubleSlash && input[i] === '/' && input[i+1] === '/' && input[i+2] === ' ') {
        // console.log('A MULTISINGLE')
        i += 2;
        pastfirstDoubleSlash = true;
        removeTrailingSpaces = true;
        continue;
      } else if (removeTrailingSpaces && input[i] === ' ' && input[i+1] === ' ') {
        // skip whitespace
        continue;
      } else if (removeTrailingSpaces && input[i] === ' ' && input[i+1] !== ' ') {
        removeTrailingSpaces = false;
        // skip whitespace
        continue;
      } else if (input[i] === '\n' ) {
        insideSinglelineComment = true;
        insideMultiSinglelineComment = false;
        pastfirstDoubleSlash = false;
        i -= 1;
        continue;
      }
    } else if (insideMultiSingleMaybe) {
      if (input[i] === '/' && input[i+1] === '/' ) {
        // console.log('IS IS A MULTISINGLE!')
        i += 2;
        insideMultiSingleMaybe = false;
        insideMultiSinglelineComment = true;
        continue;
      } else if (input[i] === ' ') {
        // console.log('NOT SURE CONTINUE as MULTISINGLE')
        // skip whitespace
        continue;
      } else {
        // console.log('NOT A MULTISINGLE!')
        i -= 1;
        flush();
        insideMultiSinglelineComment = false;
        insideMultiSingleMaybe = false;
        continue;
      }
    } else if (input[i] === '/') {
      if (input[i + 1] === '*') {
        flush();
        currentNode.type = 'comment';
        insideMultilineComment = true;
        i += 1;
        continue;
      } else if (input[i + 1] === '/' && input[i + 2] === ' ') {
        flush();
        currentNode.type = 'comment';
        insideSinglelineComment = true;
        i += 1;
        continue;
      }
    }

    currentNode.string += input[i];
  }

  flush();
  return nodes;

  function flush() {
    // console.log('>>>>> FLUSHED!')
    currentNode.string = util.trimString(currentNode.string);
    nodes.push(currentNode);
    currentNode = { type: 'code', string: '' };
  }
};

/**
 * Parses `jsdoc` "examples" for our doctests out of the parsed comments.
 *
 * @param {Array} parsedComments Parsed output from `parseComments`
 * @return {Array} parsedExamples
 */

exports.parseExamples = function commentParser$parseExamples(parsedComments) {
  var examples = [];
  var currentExample = { expectedResult: '' };
  var caption;
  var currentCaption;
  console.log('parsedComments', JSON.stringify(parsedComments,true,2))

  for (var i = 0, len = parsedComments.length; i < len; i++) {
    if (parsedComments[i].type === 'code') {
      if (currentExample.testCase) flush();
      currentExample.testCase = parsedComments[i].string
        //.replace(/\n/g, ';')
        .replace(/^<caption>.+<\/caption>\s*/, '')
        .replace(/;$/, '');
      currentExample.displayTestCase = parsedComments[i].string
        .replace(/\n\s*\./g, '.')
        .replace(/\n/g, ';')
        .replace(/^<caption>.+<\/caption>\s*/, '')
        .replace(/;$/, '');

      currentCaption = parsedComments[i].string.match(/^<caption>(.+)<\/caption>/);
      if (currentCaption && currentCaption[1]) {
        caption = currentCaption[1];
      }

      if (caption) {
        currentExample.label = currentExample.testCase + ' - ' + caption;
      }
    } else if (parsedComments[i].type === 'comment' && currentExample.testCase) {
      if (parsedComments[i].string.indexOf('=>') === 0) {
        currentExample.expectedResult += parsedComments[i].string.slice(3);
      } else if (parsedComments[i].string.indexOf('async =>') === 0) {
        currentExample.expectedResult += parsedComments[i].string.slice(9);
        currentExample.isAsync = true;
      } else if (parsedComments[i].string.indexOf('async !>') === 0) {
        currentExample.expectedResult += parsedComments[i].string.slice(9);
        currentExample.isAsyncError = true;
      } else if (parsedComments[i].string.indexOf('~>') === 0) {
        currentExample.expectedResult += parsedComments[i].string.slice(3);
        currentExample.isPromise = true;
      }
    }
  }

  flush();

  return examples;

  function flush() {
    if (currentExample.expectedResult) {
      examples.push(currentExample);
    }

    currentExample = { expectedResult: '' };
  }
};
