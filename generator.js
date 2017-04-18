const ASTClasses = require('./ast.js');
util = require('util');  // Just for debugging purposes

// BUG: When the generator function is called `gen`, it is never called. ???

////////////////////////////////////////////////////////////////////////////////
// NOTE: All generator() functions return a string.
//       Only statements new-line.
////////////////////////////////////////////////////////////////////////////////

let INDENT = "    ";
let indentLevel = 0;

function indentLine(line) {
    return `${INDENT.repeat(indentLevel)}${line}`;
}

function indentLineList(statementList) {
    let code = ``;
    indentLevel += 1;
    statementList
    statementList.forEach(function(statement) {
        code += `${statement.generator()}`;
    });
    indentLevel -= 1;
    return code;
}

Object.assign(ASTClasses.Program.prototype, {
    generator() {
        return this.block.generator();
    },
});

Object.assign(ASTClasses.Block.prototype, {
    generator() {
        return indentLineList(this.body);
    },
});

Object.assign(ASTClasses.BranchStatement.prototype, {
    generator() {
        console.log(`DEBUG: BranchStatement generator was called`);
        return `yay`;
        let code = ``;
        let self = this;
        this.thenBlocks.forEach(function (thenBlock, i) {
            code += indentLine(`${i === 0 ? `if` : `else if`} (${self.conditions[i].generator()}) {`);
            code += `${thenBlock.generator()}`
            code += indentLine(`}\n`);
        });
        if (this.elseBlock !== "undefined") {
            code += indentLine(`else {`);
            code += `${this.elseBlock.generator()}`;
            code += indentLine(`}\n`);
        }
        return code;
    },
});

Object.assign(ASTClasses.FunctionDeclarationStatement.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.ClassDeclarationStatement.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.MatchStatement.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.BranchStatement.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.WhileStatement.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.ForInStatement.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.PrintStatement.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.AssignmentStatement.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.IdentifierStatement.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.ReturnStatement.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.MatchExpression.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.Match.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.Parameter.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.BinaryExpression.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.UnaryExpression.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.ParenthesisExpression.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.Variable.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.IdExpression.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.IdExpressionBodyRecursive.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.IdExpressionBodyBase.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.PeriodId.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.Arguments.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.IdSelector.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.List.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.Tuple.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.Dictionary.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.IdValuePair.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.VarList.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.BoolLit.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.IntLit.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.FloatLit.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.StringLit.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.NullLit.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.ConstId.prototype, {
    generator() {

    }
});

Object.assign(ASTClasses.ClassId.prototype, {
    generator() {

    }
});
