/*
 * grunt-rev
 * https://github.com/TinyGaga/grunt-rev
 *
 * Copyright (c) 2013 Sebastiaan Deckers
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
  path = require('path'),
  crypto = require('crypto');

module.exports = function(grunt) {

  function md5(filepath, algorithm, encoding, fileEncoding) {
    var hash = crypto.createHash(algorithm);
    grunt.log.verbose.write('Hashing ' + filepath + '...');
    hash.update(grunt.file.read(filepath), fileEncoding);
    return hash.digest(encoding);
  }

  grunt.registerMultiTask('revhashmap', 'Hashing files and create a hashMap', function() {

    var options = this.options({
      encoding: 'utf8',
      algorithm: 'md5',
      length: 8,
      mapping: false
    });

    this.files.forEach(function(filePair) {

      var dest = filePair.dest,
          cwd = filePair.cwd,
          maps = {};

      filePair.src.forEach(function(f){
        var filepath = path.join(cwd, f),
            hash = md5(filepath, options.algorithm, 'hex', options.encoding),
            prefix = hash.slice(0, options.length),
            renamed = [prefix, path.basename(filepath)].join('.'),
            outPath = path.resolve(path.dirname(filepath), renamed);

        grunt.verbose.ok().ok(hash);
        maps[f] = prefix;
        fs.renameSync(filepath, outPath);
        grunt.log.write(f + ' ').ok(renamed);
      });

      if(options.mapping){

        grunt.file.write(path.join(dest, 'hashMap.json'), JSON.stringify(maps, null, 4)); 

        console.log(path.join(dest, 'hashMap.json').toString().cyan + ' created!' );

      } 
    });
  });

};
