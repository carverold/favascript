const ASTClasses = require('./ast.js');

// From what I can tell, this modifies the existing Program class. TODO: Read up on "prototypes"

Object.assign(ASTClasses.Program.prototype, {
    gen() {
        //this.statements.forEach(statement => statement.gen());
        return "This is placeholder output for the generator";
    }
});

Object.assign(ASTClasses.Block.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.BranchStatement.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.FunctionDeclarationStatement.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.ClassDeclarationStatement.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.MatchStatement.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.BranchStatement.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.WhileStatement.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.ForInStatement.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.PrintStatement.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.AssignmentStatement.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.IdentifierStatement.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.ReturnStatement.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.MatchExpression.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.Match.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.Parameter.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.BinaryExpression.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.UnaryExpression.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.ParenthesisExpression.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.Variable.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.IdExpression.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.IdExpressionBodyRecursive.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.IdExpressionBodyBase.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.PeriodId.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.Arguments.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.IdSelector.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.List.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.Tuple.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.Dictionary.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.IdValuePair.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.VarList.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.BoolLit.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.IntLit.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.FloatLit.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.StringLit.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.NullLit.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.ConstId.prototype, {
    gen() {

    }
});

Object.assign(ASTClasses.ClassId.prototype, {
    gen() {

    }
});