fs = require('fs');
path = require('path');
ohm = require('ohm-js');
assert = require('assert');
grammarContents = fs.readFileSync('favascript.ohm');
grammar = ohm.grammar(grammarContents);
validPrograms = path.resolve('./test/grammar/programs/valid');
invalidPrograms = path.resolve('./test/grammar/programs/invalid');

tests = function(validFiles, invalidFiles) {
  describe('Grammar tests', function() {
    describe('Test valid example programs', function() {
      validFiles.forEach(function(file) {
        it('grammar\\programs\\valid\\' +file.name + ' should be accepted by the grammar',
          function() {
            grammarResult = grammar.match(file.code);
            assert.equal(grammarResult.succeeded(), true,
              'Returned: ' + grammarResult);
        });
      });
    });

    describe('Test invalid example programs', function() {
      invalidFiles.forEach(function(file) {
        it('grammar\\programs\\invalid\\' + file.name + ' should be rejected by the grammar',
          function() {
            grammarResult = grammar.match(file.code);
            assert.equal(grammarResult.succeeded(), false,
              'Returned: ' + grammarResult);
        });
      });
    });
  });
};

(function() {
  validFiles = [];
  invalidFiles = [];

  fs.readdirSync(validPrograms).forEach(function(fileName) {
    fullFilePath = validPrograms + '/' + fileName;
    fileContents = fs.readFileSync(fullFilePath, 'utf-8');
    validFiles.push({
      name: fileName,
      code: fileContents
    });
  });

  fs.readdirSync(invalidPrograms).forEach(function(fileName) {
    fullFilePath = invalidPrograms + '/' + fileName;
    fileContents = fs.readFileSync(fullFilePath, 'utf-8');
    invalidFiles.push({
      name: fileName,
      code: fileContents
    });
  });

  tests(validFiles, invalidFiles);
}());
