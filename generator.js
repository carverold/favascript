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

let lastId = -1;  // Make it 0-indexed
let map = new Map();

// Taken from Prof. Toal's Plainscript example:
const jsName = (() => {
  return (identifier) => {
    if (!(map.has(identifier))) {
      map.set(identifier, ++lastId);  // eslint-disable-line no-plusplus
    }
    return `v_${map.get(identifier)}`;
  };
})();

Object.assign(ASTClasses.Program.prototype, {
    gen() {
        lastId = -1;
        map = new Map();
        return this.block.gen().slice(0, -1);  // slice to omit the last new line (which is empty)
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

Object.assign(ASTClasses.ClassDeclarationStatement.prototype, {
    gen() {
        let code = ``;
        code += indentLine(`class ${jsName(this.id)} {\n`);
        code += this.block.gen();
        code += indentLine(`}\n`);
        return code;
    }
});

Object.assign(ASTClasses.FunctionDeclarationStatement.prototype, {
    gen() {
        let code = ``;
        let parameterArrayCode = [];
        let funcId = this.isConstructor ? "constructor" : jsName(this.id);
        this.parameterArray.forEach(function(parameter) {
            parameterArrayCode.push(parameter.gen());
        });
        if (this.ownerClass !== null && this.ownerClass !== undefined && this.ownerClass !== "undefined") {
            code += indentLine(`${funcId}(${parameterArrayCode.join(`, `)}) {\n`);
        } else {
            code += indentLine(`let ${jsName(this.id)} = function (${parameterArrayCode.join(`, `)}) {\n`);
        }
        code += this.block.gen();  // remember: indentLineList called within block
        code += indentLine(`}\n`);
        return code;
    }
});

Object.assign(ASTClasses.Parameter.prototype, {
    gen() {
        return `${jsName(this.id)}${this.defaultValue !== `undefined` && this.defaultValue !== null ? ` = ${this.defaultValue.gen()}` : ``}`;
    }
});

Object.assign(ASTClasses.MatchStatement.prototype, {
    gen() {
        return `${this.matchExp.gen()}`;
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
        code += indentLine(`for (var ${jsName(this.id)} in ${this.iDExp.gen()}) {`);
        code += this.block.gen();
        code += indentLine(`}`);
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
        if (this.idExp.id === "this") {
            return indentLine(`${this.idExp.gen()} ${this.assignOp} ${this.exp.gen()};\n`);
        } else {
            if (this.isConstant) {
                return indentLine(`${this.assignOp === `=` ? `const ` : ``}${this.idExp.gen()} ${this.assignOp} ${this.exp.gen()};\n`);
            } else {
                return indentLine(`${this.assignOp === `=` ? `let ` : ``}${this.idExp.gen()} ${this.assignOp} ${this.exp.gen()};\n`);
            }
        }
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
        let code = ``;
        if (this.varArray.length > 0) {
            code += indentLine(`if (${this.idExp.gen()} === ${this.varArray[0].gen()}) {\n`);
            code += (`${this.matchArray[0].gen()}`);
            code += indentLine(`}\n`);
        }
        for (let v = 1; v < this.varArray.length; v++) {
            code += indentLine(`else if (${this.idExp.gen()} === ${this.varArray[v].gen()}) {\n`);
            code += (`${this.matchArray[v].gen()}`);
            code += indentLine(`}\n`);
        }
        if (this.matchFinal) {
            code += indentLine(`else {\n`);
            code += (`${this.matchFinal.gen()}`);
            code += indentLine(`}\n`);
        }
        return code;
    }
});

Object.assign(ASTClasses.Match.prototype, {
    gen() {
        // return `${this.matchee.gen()}`;
        return indentLine(`${this.matchee.gen()}`);
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
        return `${jsName(this.id)}`;
    }
});

Object.assign(ASTClasses.PeriodId.prototype, {
    gen() {
        return `${jsName(this.id)}`;
    }
});

Object.assign(ASTClasses.Arguments.prototype, {
    gen() {
        return `${this.args.gen()}`;
    }
});

Object.assign(ASTClasses.IdSelector.prototype, {
    gen() {
        return `${this.variable.gen()}`;
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
        return `${jsName(this.id)}: ${this.variable.gen()}`;
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
        return `${jsName(this.id)}`;
    }
});

Object.assign(ASTClasses.ClassId.prototype, {
    gen() {
        return `${jsName(this.id)}`;
    }
});

module.exports = {
    lastId: lastId
};
