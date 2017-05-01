fs = require('fs');
path = require('path');
ohm = require('ohm-js');
assert = require('assert');
util = require('util');
grammarContents = fs.readFileSync('favascript.ohm');
grammar = ohm.grammar(grammarContents);
ast = require(path.resolve('./ast.js'));
validPrograms = path.resolve('./test/optimization/programs/valid');
invalidPrograms = path.resolve('./test/optimization/programs/invalid');
validProgramsOptimized = path.resolve('./test/optimization/code/valid');
// invalidProgramAsts = path.resolve('./test/ast/ast/invalid');

tests = function(validFiles, invalidFiles) {
  describe('Optimization tests', function() {
    describe('Test valid example programs', function() {
      validFiles.forEach(function(file) {
        it('optimization\\programs\\valid\\' +file.name + ' should optimize without error',
          function() {
            let program = parser(file.code);
            program.analyze();
            assert.equal(program.optimize(), optCode[file.name], // ************************************************************************************************************************
              'Returned: ' + grammarResult);
        });
      });
    });

    // describe('Test invalid example programs', function() {
    //   invalidFiles.forEach(function(file) {
    //     it('ast\\programs\\invalid\\' + file.name + ' should be rejected by the grammar',
    //       function() {
    //         grammarResult = grammar.match(file.code);
    //         assert.equal(grammarResult.succeeded(), false,
    //           'Returned: ' + grammarResult);
    //     });
    //   });
    // });
  });
};

(function() {
  validFiles = [];
  invalidFiles = [];

  fs.readdirSync(validPrograms).forEach(function(fileName) {
    fullProgramPath = validPrograms + '/' + fileName;
    fullOptimizedCodePath = validProgramsOptimized + '/' + fileName;
    programFileContents = fs.readFileSync(fullProgramPath, 'utf-8');
    // if(fileName == "match1.fav") {
    validFiles.push({
      name: fileName,
      code: programFileContents
    });
    // }
  });

  // fs.readdirSync(invalidPrograms).forEach(function(fileName) {
  //   fullFilePath = invalidPrograms + '/' + fileName;
  //   fileContents = fs.readFileSync(fullFilePath, 'utf-8');
  //   invalidFiles.push({
  //     name: fileName,
  //     code: fileContents
  //   });
  // });

  tests(validFiles, invalidFiles);
}());

optCode = {
    'arithmetic1.fav': require(path.resolve(validProgramsOptimized + '/arithmetic1.js')).getOptimized(),
    'arithmetic2.fav': require(path.resolve(validProgramsOptimized + '/arithmetic2.js')).getOptimized(),
    'binaryExpression.fav': require(path.resolve(validProgramsOptimized + '/binaryExpression.js')).getOptimized(),
    'class1.fav': require(path.resolve(validProgramsOptimized + '/class1.js')).getOptimized(),
    'conditional1.fav': require(path.resolve(validProgramsOptimized + '/conditional1.js')).getOptimized(),
    'constDecl1.fav': require(path.resolve(validProgramsOptimized + '/constDecl1.js')).getOptimized(),
    'constDecl2.fav': require(path.resolve(validProgramsOptimized + '/constDecl2.js')).getOptimized(),
    'decl1.fav': require(path.resolve(validProgramsOptimized + '/decl1.js')).getOptimized(),
    'decl2.fav': require(path.resolve(validProgramsOptimized + '/decl2.js')).getOptimized(),
    'decl3.fav': require(path.resolve(validProgramsOptimized + '/decl3.js')).getOptimized(),
    'decl4.fav': require(path.resolve(validProgramsOptimized + '/decl4.js')).getOptimized(),
    'dict1.fav': require(path.resolve(validProgramsOptimized + '/dict1.js')).getOptimized(),
    'dict2.fav': require(path.resolve(validProgramsOptimized + '/dict2.js')).getOptimized(),
    'funcDecl1.fav': require(path.resolve(validProgramsOptimized + '/funcDecl1.js')).getOptimized(),
    'funcDecl2.fav': require(path.resolve(validProgramsOptimized + '/funcDecl2.js')).getOptimized(),
    'idExp1.fav': require(path.resolve(validProgramsOptimized + '/idExp1.js')).getOptimized(),
    'idExp2.fav': require(path.resolve(validProgramsOptimized + '/idExp2.js')).getOptimized(),
    'ifElse1.fav': require(path.resolve(validProgramsOptimized + '/ifElse1.js')).getOptimized(),
    'ifElse2.fav': require(path.resolve(validProgramsOptimized + '/ifElse2.js')).getOptimized(),
    'match1.fav': require(path.resolve(validProgramsOptimized + '/match1.js')).getOptimized(),
    'match2.fav': require(path.resolve(validProgramsOptimized + '/match2.js')).getOptimized(),
    'print1.fav': require(path.resolve(validProgramsOptimized + '/print1.js')).getOptimized(),
    'shortMatch.fav': require(path.resolve(validProgramsOptimized + '/shortMatch.js')).getOptimized(),
    'tuple.fav': require(path.resolve(validProgramsOptimized + '/tuple.js')).getOptimized(),
    'while1.fav': require(path.resolve(validProgramsOptimized + '/while1.js')).getOptimized()
};
