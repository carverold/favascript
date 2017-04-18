const ASTClasses = require('./ast.js');
util = require('util');  // Just for debugging purposes

// BUG: When the gen function is called `gen`, it is never called. ???

////////////////////////////////////////////////////////////////////////////////
// NOTE: All gen() functions return a string.
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
    statementList.forEach(function(statement) {
        code += `${statement.gen()}`;
    });
    indentLevel -= 1;
    return code;
}

Object.assign(ASTClasses.Program.prototype, {
    gen() {
        return this.block.gen();
    },
});

Object.assign(ASTClasses.Block.prototype, {
    gen() {
        return indentLineList(this.body);
    },
});

Object.assign(ASTClasses.BranchStatement.prototype, {
    gen() {
        console.log(`DEBUG: BranchStatement gen was called`);
        return `yay`;
        let code = ``;
        let self = this;
        this.thenBlocks.forEach(function (thenBlock, i) {
            code += indentLine(`${i === 0 ? `if` : `else if`} (${self.conditions[i].gen()}) {`);
            code += `${thenBlock.gen()}`

            code += indentLine(`}\n`);
        });
        if (this.elseBlock !== "undefined") {
            code += indentLine(`else {`);
            code += `${this.elseBlock.gen()}`;
            code += indentLine(`}\n`);
        }
        return code;
    },
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
        return `${this.boolVal}`;
    }
});

Object.assign(ASTClasses.IntLit.prototype, {
    gen() {
        return `${this.digits}`;
    }
});

Object.assign(ASTClasses.FloatLit.prototype, {
    gen() {
        return `${this.value}`;
    }
});

Object.assign(ASTClasses.StringLit.prototype, {
    gen() {
        return `${this.value}`;
    }
});

Object.assign(ASTClasses.NullLit.prototype, {
    gen() {
        return `null`;
    }
});

Object.assign(ASTClasses.ConstId.prototype, {
    gen() {
        return `${this.id}`;
    }
});

Object.assign(ASTClasses.ClassId.prototype, {
    gen() {
        return `${this.id}`;
    }
});
