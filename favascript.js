// Largely based off of Toal's Plainscript example...
// TODO: Add functionality with future homeworks.

const argv = require('yargs')
    .usage('$0 [-a] [-s] filename')
    .boolean(['a', 's'])
    .describe('a', 'parse, then generate an AST')
    .describe('s', 'perform semantic analysis')
    .demand(1)
    .argv;

const usageString = `Guavascript Usage:

node guavascript.js -a <filename>
    The '-a' option prints the abstract syntax tree.

node guavascript.js -s <filename>
    The '-s' option runs a complete semantic analysis and prints errors, if any.`

const fs = require('fs');
const path = require('path');
const parser = require(path.resolve('./parser.js'));

fs.readFile(argv._[0], 'utf-8', (err, text) => {
    let program = parser(text);
    if (argv.a) {
        console.log(program.toString());
        return;
    } if (argv.s) {

        // TODO: Move this outside of "if (argv.s)" so that further
        // processes will have the AST semantically checked
        program.analyze();

    } else {
        console.log(usageString);
    }
})
