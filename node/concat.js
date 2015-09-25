'use strict';

module.exports = concat;

var async = require('async');
var fs = require('fs');
var node_path = require('path');
var lib = node_path.join(__dirname, '..', 'lib');

// - files: {Array}
// - intro: {String}
// - outro: {String}
function concat(options, callback) {
  var files = options.files.map(function(file, i) {
    return {
      path: node_path.join(lib, file + '.js'),
      index: i
    }
  });

  var contents = [];
  async.each(files, function(task, done) {
    fs.readFile(task.path, function(err, content) {
      if (err) {
        return done(err);
      }

      contents[task.index] = content.toString();
      done(null);
    });

  }, function(err) {
    if (err) {
      return callback(err);
    }

    var intro = options.intro ? options.intro + '\n\n\n' : '';

    var outro = options.outro ? '\n\n\n' + options.outro : '';

    var content = intro + contents.join('\n\n') + outro;
    callback(null, content);
  });
}

var FILES = {
  'normal': [
    'intro',
    'util',
    'event',
    'module',
    'asset',
    'define',
    'load',
    'config',
    'exports'
  ],

  'safe-ecma5': [
    'intro',
    'ecma5',
    'util',
    'event',
    'module',
    'asset',
    'define',
    'load',
    'config',
    'exports'
  ]
};


['normal', 'safe-ecma5'].forEach(function(type) {
  concat[type] = function(callback) {
    concat({
      intro: '(function(ENV){',
      outro: '// Use `this`, and never cares about the environment.\n' + '})(this);',
      files: FILES[type]
    }, callback);
  };
});