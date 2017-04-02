fs = require('fs');
path = require('path');
ohm = require('ohm-js');
assert = require('assert');
util = require('util');
parser = require(path.resolve('./parser.js'));
validPrograms = path.resolve('./test/parser/programs/valid');
invalidPrograms = path.resolve('./test/parser/programs/invalid');
validProgramAsts = path.resolve('./test/parser/ast/valid');
// invalidProgramAsts = path.resolve('./test/parser/ast/invalid');

tests = function(validFiles, invalidFiles) {
  describe('Parser tests', function() {
    describe('Test valid example programs', function() {
      validFiles.forEach(function(file) {
        it('parser\\programs\\valid\\' +file.name + ' should be accepted by the grammar',
          function() {
            // console.log(util.inspect(parser(file.code), {depth: null}));
            assert.equal(parser(file.code).toString(), asts[file.name],
              'Returned: ' + grammarResult);
        });
      });
    });

    // describe('Test invalid example programs', function() {
    //   invalidFiles.forEach(function(file) {
    //     it('parser\\programs\\invalid\\' + file.name + ' should be rejected by the grammar',
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
    fullAstPath = validProgramAsts + '/' + fileName;
    programFileContents = fs.readFileSync(fullProgramPath, 'utf-8');
    // if(fileName == "match1.guav") {
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

asts = {
    'arithmetic1.guav': require(path.resolve(validProgramAsts + '/arithmetic1.js')).getAst(),
    'arithmetic2.guav': require(path.resolve(validProgramAsts + '/arithmetic2.js')).getAst(),
    'class1.guav': require(path.resolve(validProgramAsts + '/class1.js')).getAst(),
    'conditional1.guav': require(path.resolve(validProgramAsts + '/conditional1.js')).getAst(),
    'constDecl1.guav': require(path.resolve(validProgramAsts + '/constDecl1.js')).getAst(),
    'constDecl2.guav': require(path.resolve(validProgramAsts + '/constDecl2.js')).getAst(),
    'decl1.guav': require(path.resolve(validProgramAsts + '/decl1.js')).getAst(),
    'decl2.guav': require(path.resolve(validProgramAsts + '/decl2.js')).getAst(),
    'decl3.guav': require(path.resolve(validProgramAsts + '/decl3.js')).getAst(),
    'decl4.guav': require(path.resolve(validProgramAsts + '/decl4.js')).getAst(),
    'dict1.guav': require(path.resolve(validProgramAsts + '/dict1.js')).getAst(),
    'dict2.guav': require(path.resolve(validProgramAsts + '/dict2.js')).getAst(),
    'funcDecl1.guav': require(path.resolve(validProgramAsts + '/funcDecl1.js')).getAst(),
    'funcDecl2.guav': require(path.resolve(validProgramAsts + '/funcDecl2.js')).getAst(),
    'funcDecl3.guav': require(path.resolve(validProgramAsts + '/funcDecl3.js')).getAst(),
    'idExp1.guav': require(path.resolve(validProgramAsts + '/idExp1.js')).getAst(),
    'idExp2.guav': require(path.resolve(validProgramAsts + '/idExp2.js')).getAst(),
    'idExp3.guav': require(path.resolve(validProgramAsts + '/idExp3.js')).getAst(),
    'ifElse.guav': require(path.resolve(validProgramAsts + '/ifElse.js')).getAst(),
    'match1.guav': require(path.resolve(validProgramAsts + '/match1.js')).getAst(),
    'match2.guav': require(path.resolve(validProgramAsts + '/match2.js')).getAst(),
    'print1.guav': require(path.resolve(validProgramAsts + '/print1.js')).getAst(),
    'shortMatch.guav': require(path.resolve(validProgramAsts + '/shortMatch.js')).getAst(),
    'tuple.guav': require(path.resolve(validProgramAsts + '/tuple.js')).getAst(),
    'while1.guav': require(path.resolve(validProgramAsts + '/while1.js')).getAst(),
    'bigProgram.guav': require(path.resolve(validProgramAsts + '/bigProgram.js')).getAst()
};
