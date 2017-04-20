const argv = require('yargs')
    .usage('$0 [-a] [-s] [-g] filename')
    .boolean(['a', 's', 'g'])
    .describe('a', 'parse, then generate an AST')
    .describe('s', 'perform semantic analysis')
    .describe('g', 'generate Javascript code')
    .demand(1)
    .argv;

const fs = require('fs');
const path = require('path');
const parser = require(path.resolve('./parser.js'));
const generator = require(path.resolve('./generator.js'));

fs.readFile(argv._[0], 'utf-8', (err, text) => {
    let program = parser(text);
    if (argv.a) {
        console.log(program.toString());
        return;
    }
    if (argv.s) {
        program.analyze();
        return;
    }
    if (argv.g) {
        program.analyze();
        console.log(program.gen());
        return;
    }
})
