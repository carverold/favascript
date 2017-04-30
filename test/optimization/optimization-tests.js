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
validProgramsJSCode = path.resolve('./test/optimization/code/valid');
// invalidProgramAsts = path.resolve('./test/ast/ast/invalid');

tests = function(validFiles, invalidFiles) {
  describe('Optimization tests', function() {
    describe('Test valid example programs', function() {
      validFiles.forEach(function(file) {
        it('optimization\\programs\\valid\\' +file.name + ' should optimize without error',
          function() {
            let program = parser(file.code);
            program.analyze();
            assert.equal(program.optimize(), jsCode[file.name], // ************************************************************************************************************************
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
    fullJSCodePath = validProgramsJSCode + '/' + fileName;
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

jsCode = {
    'arithmetic1.fav': require(path.resolve(validProgramsJSCode + '/arithmetic1.js')).getJSCode(),
    'arithmetic2.fav': require(path.resolve(validProgramsJSCode + '/arithmetic2.js')).getJSCode(),
    'binaryExpression.fav': require(path.resolve(validProgramsJSCode + '/binaryExpression.js')).getJSCode(),
    'class1.fav': require(path.resolve(validProgramsJSCode + '/class1.js')).getJSCode(),
    'conditional1.fav': require(path.resolve(validProgramsJSCode + '/conditional1.js')).getJSCode(),
    'constDecl1.fav': require(path.resolve(validProgramsJSCode + '/constDecl1.js')).getJSCode(),
    'constDecl2.fav': require(path.resolve(validProgramsJSCode + '/constDecl2.js')).getJSCode(),
    'decl1.fav': require(path.resolve(validProgramsJSCode + '/decl1.js')).getJSCode(),
    'decl2.fav': require(path.resolve(validProgramsJSCode + '/decl2.js')).getJSCode(),
    'decl3.fav': require(path.resolve(validProgramsJSCode + '/decl3.js')).getJSCode(),
    'decl4.fav': require(path.resolve(validProgramsJSCode + '/decl4.js')).getJSCode(),
    'dict1.fav': require(path.resolve(validProgramsJSCode + '/dict1.js')).getJSCode(),
    'dict2.fav': require(path.resolve(validProgramsJSCode + '/dict2.js')).getJSCode(),
    'funcDecl1.fav': require(path.resolve(validProgramsJSCode + '/funcDecl1.js')).getJSCode(),
    'funcDecl2.fav': require(path.resolve(validProgramsJSCode + '/funcDecl2.js')).getJSCode(),
    'idExp1.fav': require(path.resolve(validProgramsJSCode + '/idExp1.js')).getJSCode(),
    'idExp2.fav': require(path.resolve(validProgramsJSCode + '/idExp2.js')).getJSCode(),
    'ifElse.fav': require(path.resolve(validProgramsJSCode + '/ifElse.js')).getJSCode(),
    'match1.fav': require(path.resolve(validProgramsJSCode + '/match1.js')).getJSCode(),
    'match2.fav': require(path.resolve(validProgramsJSCode + '/match2.js')).getJSCode(),
    'print1.fav': require(path.resolve(validProgramsJSCode + '/print1.js')).getJSCode(),
    'shortMatch.fav': require(path.resolve(validProgramsJSCode + '/shortMatch.js')).getJSCode(),
    'tuple.fav': require(path.resolve(validProgramsJSCode + '/tuple.js')).getJSCode(),
    'while1.fav': require(path.resolve(validProgramsJSCode + '/while1.js')).getJSCode()
};
