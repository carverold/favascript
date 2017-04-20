const ASTClasses = require('./ast.js');
util = require('util');  // Just for debugging purposes

let INDENT = "    ";
let indentLevel = -1;  // Initialize at -1 since Program Block will automatically increment

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
        return this.block.gen().slice(0, -1);  // slice to omit the last new line
    }
});

Object.assign(ASTClasses.Block.prototype, {
    gen() {
        return indentLineList(this.body);
    }
});

Object.assign(ASTClasses.BranchStatement.prototype, {
    gen() {
        let code = ``;
        let self = this;
        this.thenBlocks.forEach(function (thenBlock, i) {
            code += indentLine(`${i === 0 ? `if` : `else if`} (${self.conditions[i].gen()}) {\n`);
            code += `${thenBlock.gen()}`
            code += indentLine(`}\n`);
        });
        if (this.elseBlock !== "undefined" && this.elseBlock !== null) {
            code += indentLine(`else {\n`);
            code += `${this.elseBlock.gen()}`;
            code += indentLine(`}\n`);
        }
        return code;
    }
});

Object.assign(ASTClasses.FunctionDeclarationStatement.prototype, {
    gen() {
        let code = ``;
        let parameterArrayCode = [];
        let funcId = this.isConstructor ? "constructor" : this.id;
        this.parameterArray.forEach(function(parameter) {
            parameterArrayCode.push(parameter.gen());
        });
        code += indentLine(`let ${this.id} = function (${parameterArrayCode.join(`, `)}) {\n`);
        code += this.block.gen();  // remember: indentLineList called within block
        code += indentLine(`}\n`);
        return code;
    }
});

Object.assign(ASTClasses.Parameter.prototype, {
    gen() {
        return `${this.id}${this.defaultValue !== `undefined` && this.defaultValue !== null ? ` = ${this.defaultValue.gen()}` : ``}`;
    }
});

Object.assign(ASTClasses.ClassDeclarationStatement.prototype, {
    gen() {
        let code = ``;
        code += indentLine(`${this.id} {\n`);
        code += this.block.gen();
        code += indentLine(`}`);
        return code;
    }
});

Object.assign(ASTClasses.MatchStatement.prototype, {
    gen() {
        return `TODO: MatchStatement`;
    }
});

Object.assign(ASTClasses.WhileStatement.prototype, {
    gen() {
        let code = ``;
        code += indentLine(`while (${this.exp.gen()}) {\n`);
        code += this.block.gen();
        code += indentLine(`}\n`);
        return code;
    }
});

Object.assign(ASTClasses.ForInStatement.prototype, {
    gen() {
        let code = ``;
        code += indentLine(`for (var ${this.id} in ${this.iDExp.gen()}) {`);
        code += this.block.gen();
        code += identLine(`}`);
        return code;
    }
});

Object.assign(ASTClasses.PrintStatement.prototype, {
    gen() {
        return indentLine(`console.log(${this.exp.gen()});\n`);
    }
});

Object.assign(ASTClasses.AssignmentStatement.prototype, {
    gen() {
        return indentLine(`${this.assignOp === `=` ? `let ` : ``}${this.idExp.gen()} ${this.assignOp} ${this.exp.gen()};\n`);
    }
});

Object.assign(ASTClasses.IdentifierStatement.prototype, {
    gen() {
        return indentLine(`${this.iDExp.gen()};\n`);
    }
});

Object.assign(ASTClasses.ReturnStatement.prototype, {
    gen() {
        return indentLine(`return ${this.exp.gen()};\n`);
    }
});

Object.assign(ASTClasses.MatchExpression.prototype, {
    gen() {
        return `TODO: MatchExpression gen`;
    }
});

Object.assign(ASTClasses.Match.prototype, {
    gen() {
        return `TODO: Match gen`;
    }
});

Object.assign(ASTClasses.BinaryExpression.prototype, {
    gen() {
        if (this.op === "^") {
            return `(Math.pow(${this.left.gen()}, ${this.right.gen()}))`;
        } else {
            return `(${this.left.gen()} ${this.op} ${this.right.gen()})`;
        }
    }
});

Object.assign(ASTClasses.UnaryExpression.prototype, {
    gen() {
        return `(${this.op}${this.operand.gen()})`;
    }
});

Object.assign(ASTClasses.ParenthesisExpression.prototype, {
    gen() {
        return `(${this.exp.gen()})`;
    }
});

Object.assign(ASTClasses.Variable.prototype, {
    gen() {
        return `${this.var.gen()}`;
    }
});

Object.assign(ASTClasses.IdExpression.prototype, {
    gen() {
        return `${this.idExpBody.gen()}${this.idPostOp !== null ? `this.idPostOp` : ``}`;
    }
});

Object.assign(ASTClasses.IdExpressionBodyRecursive.prototype, {
    gen() {
        let code = `${this.idExpBody.gen()}`;
        let appendageCode = `${this.idAppendage.gen()}`;
        if (this.appendageOp === "[]") {
            code += `[${appendageCode}]`;
        } else if (this.appendageOp === ".") {
            code += `.${appendageCode}`;
        } else if (this.appendageOp === "()") {
            code += `(${appendageCode})`;
        }
        return code;
    }
});

Object.assign(ASTClasses.IdExpressionBodyBase.prototype, {
    gen() {
        return `${this.id}`;
    }
});

Object.assign(ASTClasses.PeriodId.prototype, {
    gen() {
        return `${this.id}`;
    }
});

Object.assign(ASTClasses.Arguments.prototype, {
    gen() {
        return `${this.args.gen()}`;
    }
});

Object.assign(ASTClasses.IdSelector.prototype, {
    gen() {
        return `${this.variable}`;
    }
});

Object.assign(ASTClasses.List.prototype, {
    gen() {
        return `[${this.varList.gen()}]`;
    }
});

Object.assign(ASTClasses.Tuple.prototype, {
    gen() {
        return `(${this.elems.gen()})`;
    }
});

Object.assign(ASTClasses.Dictionary.prototype, {
    gen() {
        let idValuePairsCode = [];
        this.idValuePairs.forEach(function(pair) {
            idValuePairsCode.push(pair.gen());
        })
        return `{${idValuePairsCode.join(`, `)}}`;
    }
});

Object.assign(ASTClasses.IdValuePair.prototype, {
    gen() {
        return `${this.id}: ${this.variable.gen()}`;
    }
});

Object.assign(ASTClasses.VarList.prototype, {
    gen() {
        let variablesCode = [];
        this.variables.forEach(function(variable) {
            variablesCode.push(variable.gen());
        });
        return `${variablesCode.join(`, `)}`;
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
        return `\`${this.value}\``;
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
