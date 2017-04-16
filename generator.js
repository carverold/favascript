const ASTClasses = require('./ast.js');

Object.assign(ASTClasses.Program.prototype, {
    gen() {
        //this.statements.forEach(statement => statement.gen());
        return "This is placeholder output for the generator";
    },
});
