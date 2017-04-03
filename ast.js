const fs = require('fs');
const ohm = require('ohm-js');
const grammarContents = fs.readFileSync('favascript.ohm');
const grammar = ohm.grammar(grammarContents);
const Context = require('./semantics/context');

const spacer = "  ";

const TYPE = {
    BOOLEAN: "BOOLEAN",
    INTEGER: "INTEGER",
    FLOAT: "FLOAT",
    STRING: "STRING",
    LIST: "LIST",
    DICTIONARY: "DICTIONARY",
    TUPLE: "TUPLE",
    FUNCTION: "FUNCTION",
    CLASS: "CLASS",
    NULL: "NULL"
}

function defineTypePairs() {
    allTypePairs = [];
    for (let i in TYPE) {
        if (TYPE.hasOwnProperty(i)) {
            for (let j in TYPE) {
                if (TYPE.hasOwnProperty(j)) {
                    allTypePairs.push([i, j]);
                }
            }
        }
    }
}
defineTypePairs();

function canBeA(receivedType, dominantType) {
    const FLOAT_ACCEPT = [
        TYPE.FLOAT,
        TYPE.INTEGER
    ]
    // TODO: undefined?
    if (dominantType === TYPE.FLOAT) {
        return FLOAT_ACCEPT.indexOf(receivedType) > -1;
    } else {
        return receivedType === dominantType;
    }
}

function canArgumentsFitParameters(args, params) {
    return (args.length == params.length) && args.every(function(element, index) {
        return canBeA(element, params[index]);
    });
}

class Program {
    constructor(block) {
        this.block = block;
    }
    analyze(context = new Context()) {

        // Don't use createChildContextForBlock since we don't want an extra level.
        // context.parent should equal null.
        this.block.analyze(context);
    }
    toString(indent = 0) {
        return `${spacer.repeat(indent)}(Program` +
               `\n${this.block.toString(++indent)}` +
               `\n${spacer.repeat(--indent)})`;
    }
}

class Block {
    constructor(body) {
        this.body = body;
        this.returnType;
        this.numberOfReturnStatements = 0;
    }
    analyze(context) {
        let self = this;
        this.body.forEach(function(statement) {
            statement.analyze(context);
            if (statement.constructor === ReturnStatement) {
                self.numberOfReturnStatements++;
                if (self.numberOfReturnStatements <= 1) {
                    self.returnType = statement.returnType;
                } else {
                    context.throwMultipleReturnsInABlockError();
                }
            }
        });
    }
    toString(indent = 0) {
        var string = `${spacer.repeat(indent++)}(Block`;
        for (var statementIndex in this.body) {
            string += `\n${this.body[statementIndex].toString(indent)}`;
        }
        string += `\n${spacer.repeat(--indent)})`;
        return string;
    }
}

class Statement {
}

// Use this for both conditional and if/else statement
class BranchStatement extends Statement {
    constructor(conditions, thenBlocks, elseBlock) {
        super();
        this.conditions = conditions;
        this.thenBlocks = thenBlocks;
        this.elseBlock = elseBlock;
    }
    analyze(context) {
        this.conditions.forEach(function(condition) {
            condition.analyze(context);
            context.assertIsTypeBoolean(condition);
        });
        this.thenBlocks.forEach(block => block.analyze(context.createChildContextForBlock()));
        if (this.elseBlock !== null) {
            this.elseBlock.analyze(context.createChildContextForBlock());
        }
    }
    toString(indent = 0) {
        var string = `${spacer.repeat(indent++)}(If`;
        for (var i in this.conditions) {
            string += `\n${spacer.repeat(indent)}(Case` +
                      `\n${spacer.repeat(++indent)}(Condition` +
                      `\n${this.conditions[i].toString(++indent)}` +
                      `\n${spacer.repeat(--indent)})` +
                      `\n${spacer.repeat(indent)}(Body` +
                      `\n${this.thenBlocks[i].toString(++indent)}` +
                      `\n${spacer.repeat(--indent)})` +
                      `\n${spacer.repeat(--indent)})`;
        }
        if (this.elseBlock !== null) {
            string += `\n${spacer.repeat(indent)}(Else` +
                      `\n${this.elseBlock.toString(++indent)}` +
                      `\n${spacer.repeat(--indent)})`;
        }
        string += `\n${spacer.repeat(--indent)})`;
        return string;
    }
}

class FunctionDeclarationStatement extends Statement {
    constructor(id, parameterArray, block) {
        super();
        this.id = id;
        this.parameterArray = parameterArray;
        this.block = block;
    }
    analyze(context) {

        let blockContext = context.createChildContextForFunction(this.id);

        let self = this;

        // If there is a default value, instantiate the variable in the block.
        // For all vars with a default, then they must match the type.
        this.parameterArray.forEach(function(parameter) {
            parameter.analyze(context);
            if (parameter.defaultValue !== null) {
                blockContext.setVariable(parameter.id, {type: parameter.defaultValue.type});
                console.log(`Set ${parameter.id} to type ${parameter.defaultValue.type}`);
            }
        });

        // But what about ambiguous variables? They will automatically be added to the
        // context as they are declared. We would want the type of the first declaration
        // to be the official type of the var. So, we get type checking for non-default vars
        // in the rest of the function for free.

        this.block.analyze(blockContext);

        let signature = [];

        // But, we still must check that the parameters were used.
        this.parameterArray.forEach(function(parameter) {
            let entry = blockContext.get(
                parameter.id,
                true,  // silent = true
                true  // onlyThisContext = true
            );
            if (!entry) {
                // If you can't find a parameter in the block, throw unusedLocalVariable
                context.declareUnusedLocalVariable(parameter.id);
            } else {
                // At the same time, build the parameters signature
                signature.push(blockContext.get(parameter.id).type);
            }
        });

        context.setVariable(this.id, {type: TYPE.FUNCTION, returnType: this.block.returnType, parameters: signature});

    }

    toString(indent = 0) {
        var string = `${spacer.repeat(indent)}(Func` +
                    `\n${spacer.repeat(++indent)}(id ${this.id})` +
                    `\n${spacer.repeat(indent++)}(Parameters`;
        if (this.parameterArray.length !== 0) {
            for (var parameterIndex in this.parameterArray) {
                string += `\n${this.parameterArray[parameterIndex].toString(indent)}`;
            }
            string += `\n${spacer.repeat(--indent)})`;
        } else {
          string += `)`;
          indent -= 1;
        }
        string += `\n${this.block.toString(indent)}` +
                  `\n${spacer.repeat(--indent)})`;
        return string;
    }
}

class Parameter {
    constructor(id, defaultValue) {
        this.id = id;
        this.defaultValue = defaultValue;
        this.type;
    }
    analyze(context) {
        this.defaultValue.analyze(context);
        this.type = this.defaultValue.type;
    }
    toString(indent = 0) {
        var string = `${spacer.repeat(indent)}(id ${this.id}`;
        if(this.defaultValue !== null) {
            string += `, default ${this.defaultValue}`;
        }
        string += `)`
        return string
    }
}

class ClassDeclarationStatement extends Statement {
    constructor(id, block) {
        super();
        this.id = id;
        this.block = block;
    }
    analyze(context) {
        this.block.analyze(context.createChildContextForBlock());
        context.setVariable(this.id, {type: TYPE.CLASS});
    }
    toString(indent = 0) {
        return `${spacer.repeat(indent)}(Class` +
               `\n${spacer.repeat(++indent)}(id ${this.id})` +
               `\n${this.block.toString(indent)}` +
               `\n${spacer.repeat(--indent)})`;
    }
}

class MatchStatement extends Statement {
    constructor(matchExp) {
        super();
        this.matchExp = matchExp;
    }
    analyze() {
        // TODO
    }
    toString(indent = 0) {
        return `${this.matchExp.toString(indent)}`;
    }
}

class WhileStatement extends Statement {
    constructor(exp, block) {
        super();
        this.exp = exp;
        this.block = block;
    }
    analyze() {
        // TODO
    }
    toString(indent = 0) {
        return `${spacer.repeat(indent)}(While` +
          `\n${spacer.repeat(++indent)}(Condition` +
               `\n${this.exp.toString(++indent)}` +
               `\n${spacer.repeat(--indent)})` +
               `\n${spacer.repeat(indent)}(Body` +
               `\n${this.block.toString(++indent)}` +
               `\n${spacer.repeat(--indent)})` +
               `\n${spacer.repeat(--indent)})`;
    }
}

class ForInStatement extends Statement {
    constructor(id, iDExp, block) {
        super();
        this.id = id;
        this.iDExp = iDExp;
        this.block = block;
    }
    analyze() {
        // TODO
    }
    toString(indent = 0) {
        return `${spacer.repeat(indent)}(For id (${this.id}) in` +
               `\n${this.iDExp.toString(++indent)}` +
               `\n${this.block.toString(indent)}` +
               `\n${spacer.repeat(--indent)})`;
    }
}

class PrintStatement extends Statement {
    constructor(exp) {
        super();
        this.exp = exp;
    }
    analyze(context) {
        this.exp.analyze(context);
    }
    toString(indent = 0) {
        return `${spacer.repeat(indent)}(Print` +
               `\n${this.exp.toString(++indent)}` +
               `\n${spacer.repeat(--indent)})`;
    }
}

class AssignmentStatement extends Statement {
    constructor(idExp, assignOp, exp) {
        super();
        this.idExp = idExp;
        this.assignOp = assignOp;
        this.exp = exp;
    }
    analyze(context) {

        this.idExp.analyze(context);  // Will have id and type
        this.exp.analyze(context);

        if (this.assignOp == "=") {
            console.log("assign exp type: ", this.exp.type);
            if (this.exp.id !== "undefined") {
                context.setVariable(this.idExp.id, {type: context.get(this.exp.id)});
            } else {
                context.setVariable(this.idExp.id, {type: this.exp.type});
            }
        } else {
            let expectedPairs = [
                [TYPE.INTEGER, TYPE. INTEGER],
                [TYPE.INTEGER, TYPE.FLOAT],
                [TYPE.FLOAT, TYPE.INTEGER],
                [TYPE.FLOAT, TYPE.FLOAT],
            ];
            let inferredType = TYPE.FLOAT;

            if (this.idExp.type === "undefined") {
                this.idExp.enforceType(inferredType, context);
            }

            if (this.exp.type === "undefined") {
                this.exp.enforceType(inferredType, context);
            }

            context.assertBinaryOperandIsOneOfTypePairs(
                this.assignOp,
                expectedPairs,
                [this.idExp.type, this.exp.type]
            );
        }
    }
    toString(indent = 0) {
        return `${spacer.repeat(indent)}(${this.assignOp}` +
               `\n${this.idExp.toString(++indent)}` +
               `\n${this.exp.toString(indent)}` +
               `\n${spacer.repeat(--indent)})`;
    }
}

class IdentifierStatement extends Statement {
    constructor(iDExp) {
        super();
        this.iDExp = iDExp;
    }
    analyze(context) {
        this.iDExp.analyze(context);
    }
    toString(indent = 0) {
        return `${spacer.repeat(indent)}(Identifier Statement` +
              `\n${this.iDExp.toString(++indent)}` +
              `\n${spacer.repeat(--indent)})`;
    }
}

class ReturnStatement extends Statement {
    constructor(exp) {
        super();
        this.exp = exp;
        this.returnType;
    }
    analyze(context) {
        context.assertReturnInFunction();
        this.exp.analyze(context);
        this.returnType = this.exp.type;
    }
    toString(indent = 0) {
        return `${spacer.repeat(indent)}(Return` +
               `\n${this.exp.toString(++indent)}` +
               `\n${spacer.repeat(--indent)})`;
    }
}

class Expression {
}

class MatchExpression extends Expression {
    constructor(idExp, varArray, matchArray, matchFinal) {
        super();
        this.idExp = idExp;
        this.varArray = varArray;
        this.matchArray = matchArray;
        this.matchFinal = matchFinal;
    }
    analyze() {
        // TODO
    }
    toString(indent = 0) {
        var string = `${spacer.repeat(indent)}(Match Expression` +
                     `\n${this.idExp.toString(++indent)}` +
                     `\n${spacer.repeat(indent++)}(Matches`;
        if (this.varArray.length != 0 && this.varArray.length == this.matchArray.length) {
            for (var varIndex in this.varArray) {
                string += `\n${spacer.repeat(indent)}(Match` +
                          `\n${this.varArray[varIndex].toString(++indent)} ->` +
                          `\n${this.matchArray[varIndex].toString(indent)}` +
                          `\n${spacer.repeat(--indent)})`
            }
        }
        if (this.matchFinal.length > 0) {
          string += `\n${spacer.repeat(indent)}(Match` +
                    `\n${spacer.repeat(++indent)}_ ->` +
                    `\n${spacer.repeat(indent)}${this.matchFinal.toString(indent)}` +
                    `\n${spacer.repeat(--indent)})`;
        }
        string += `\n${spacer.repeat(--indent)})` +
                  `\n${spacer.repeat(--indent)})`;
        return string;
    }
}

class Match {
    constructor(matchee) {
        this.matchee = matchee;
    }
    analyze() {
        // TODO
    }
    toString(indent = 0) {
        return `${this.matchee.toString(indent)}`;
    }
}

class BinaryExpression extends Expression {
    constructor(left, op, right) {
        super();
        this.left = left;
        this.op = op;
        this.right = right;
        this.type;
    }
    analyze(context) {

        let expectedPairs;
        let inferredType;

        if (this.op == "||" || this.op == "&&") {
            expectedPairs = [[TYPE.BOOLEAN, TYPE.BOOLEAN]];
            inferredType = TYPE.BOOLEAN;
        } else if (["+", "-", "/", "*", "<=", "<", ">=", ">", "^"].indexOf(this.op) > -1) {
            expectedPairs = [
                [TYPE.INTEGER, TYPE.INTEGER],
                [TYPE.INTEGER, TYPE.FLOAT],
                [TYPE.FLOAT, TYPE.INTEGER],
                [TYPE.FLOAT, TYPE.FLOAT]
            ];
            inferredType = TYPE.FLOAT;
        } else if (this.op == "//" || this.op == "%") {
            expectedPairs = [
                [TYPE.INTEGER, TYPE.INTEGER],
                [TYPE.FLOAT, TYPE.INTEGER]
            ];
            inferredType = TYPE.INTEGER;
        } else if (this.op == "==" || this.op == "!=") {
            expectedPairs = allTypePairs;
        }

        this.left.analyze(context);
        this.right.analyze(context);

        if (this.left.type === "undefined") {
            console.log("left:", this.left);
            console.log("right:", this.right);
            this.left.enforceType(inferredType, context);
        }

        if (this.right.type === "undefined") {
            this.right.enforceType(inferredType, context);
        }

        // TODO: What if inferredType is undefined, like when op = "==" or "!="?

        // canBeA(this.operand.type, inferredType)

        context.assertBinaryOperandIsOneOfTypePairs(
            this.op,
            expectedPairs,
            [this.left.type, this.right.type]
        );

        // Should we be taking this.left.type or inferredType?
        this.type = this.left.type;

    }
    enforceType(type, context) {
        console.log(`Enforcing type ${type} for BinaryExpression`);
        if (this.left.type == "undefined") {
            this.left.enforceType(type, context);
        }
        if (!canBeA(this.left.type, type)) {
            context.throwCantResolveTypesError(this.left.type, type);
        }
        if (this.right.type == "undefined") {
            this.right.enforceType(type, context);
        }
        if (!canBeA(this.right.type, type)) {
            context.throwCantResolveTypesError(this.right.type, type);
        }
    }
    toString(indent = 0) {
        return `${spacer.repeat(indent)}(${this.op}` +
               `\n${this.left.toString(++indent)}` +
               `\n${this.right.toString(indent)}` +
               `\n${spacer.repeat(--indent)})`;
    }
}

class UnaryExpression extends Expression {
    constructor(op, operand) {
        super();
        this.op = op;
        this.operand = operand;
        this.type;
    }
    analyze(context) {

        let expectedTypes;
        let inferredType;

        if (this.op == "--" || this.op == "++") {
            expectedTypes = [TYPE.INTEGER];
            inferredType = TYPE.INTEGER;
        } else if (this.op == "-") {
            expectedTypes = [TYPE.INTEGER, TYPE.FLOAT];
            inferredType = TYPE.FLOAT;
        } else if (this.op == "!") {
            expectedTypes = [TYPE.BOOLEAN];
            inferredType = TYPE.BOOLEAN;
        }

        this.operand.analyze(context);

        if (this.operand.type == "undefined") {
            this.operand.enforceType(inferredType, context);
        }

        context.assertUnaryOperandIsOneOfTypes(this.op, expectedTypes, this.operand.type);

        this.type = this.operand.type;  // TODO: or should this be inferredType?
    }
    enforceType(type, context) {
        console.log(`Enforcing type ${type} for UnaryExpression`);
        if (this.operand.type == "undefined") {
            this.operand.enforceType(type, context);
            this.type = this.operand.type;
        }
        if (!canBeA(this.operand.type, type)) {
            context.throwCantResolveTypesError(this.operand.type, type);
        }
    }
    toString(indent = 0) {
        return `${spacer.repeat(indent)}(${this.op}\n${this.operand.toString(++indent)})`;
    }
}

class ParenthesisExpression extends Expression {
    constructor(exp) {
        super();
        this.exp = exp;
        this.type;
    }
    analyze(context) {
        this.exp.analyze(context);
        this.type = this.exp.type;
    }
    enforceType(type, context) {
        console.log(`Enforcing type ${type} for ParenthesisExpression`);
        if (this.exp.type == "undefined") {
            this.exp.enforceType(type, context);
            this.type = this.exp.type;
        }
        if (!canBeA(this.exp.type, type)) {
            context.throwCantResolveTypesError(this.exp.type, type);
        }
    }
    toString(indent = 0) {
        // Don't increase indent, as the semantic meaning of parenthesis are already captured in the tree
        return `${this.exp.toString(indent)}`;
    }
}

class Variable extends Expression {
    constructor(variable) {
        super();
        this.var = variable;
        this.type;
    }
    analyze(context) {
        console.log("Analyzing Variable");
        this.var.analyze(context);
        this.type = this.var.type;
    }
    enforceType(type, context) {
        console.log(`Enforcing type ${type} for Variable`);
        if (this.type == "undefined") {
            this.var.enforceType(type, context);
            this.type = this.var.type;
        }
        if (!canBeA(this.type, type)) {
            context.throwCantResolveTypesError(this.type, type);
        }
    }
    toString(indent = 0) {
        // Don't increase indent, we already know literals and other data types are variables
        return `${this.var.toString(indent)}`;
    }
}

class IdExpression extends Expression {
    constructor(idExpBody, idPostOp) {
        super();
        this.idExpBody = idExpBody;
        this.idPostOp = idPostOp;
        this.id;  // baseline identifier. example: x in x.doThis(3)[1].lalala
        this.type;
    }
    analyze(context) {
        this.idExpBody.analyze(context);
        if (this.idPostOp == "++" || this.idPostOp == "--") {
            context.assertUnaryOperandIsOneOfTypes(this.idPostOp, [TYPE.INTEGER], this.idExpBody.type)
        }
        this.id = this.idExpBody.id;
        this.type = this.idExpBody.type;
    }
    enforceType(type, context) {
        console.log(`Enforcing type ${type} for IdExpression`);
        if (this.type == "undefined") {
            this.idExpBody.enforceType(type, context);
            this.type = this.idExpBody.type;
        }
    }
    toString(indent = 0) {
        return  `${spacer.repeat(indent)}(IdExpression\n` +
                `${this.idExpBody.toString(++indent)}` +
                `${(!this.idPostOp) ? "" : `\n${spacer.repeat(++indent)}${this.idPostOp}`}` +
                `\n${spacer.repeat(--indent)})`;
    }
}

class IdExpressionBodyRecursive {
    constructor(idExpBody, idAppendage) {
        this.idExpBody = idExpBody;
        this.idAppendage = idAppendage;
        this.appendageOp = idAppendage === 'undefined' ? 'undefined' : idAppendage.getOp();
        this.id;
        this.type;
    }
    analyze(context) {
        this.idExpBody.analyze(context);
        this.id = this.idExpBody.id;
        // this.type = this.idExpBody.type; NO- NEED TO BE MORE SPECIFIC

        if (this.appendageOp === "[]") {
            this.idAppendage.analyze(context);
            if (this.idExpBody.type == "undefined") {
                this.idExpBody.enforceType(TYPE.LIST, context);
            }
            context.assertIsValidListAccess(this.idExpBody.type, this.idAppendage.type);  // TODO: this.idAppendage.type is undefined
            this.type = context.get(this.idExpBody.id).elementType;
        } else if (this.appendageOp === ".") {
            this.idAppendage.analyze(context);
            if (this.idExpBody.type == "undefined") {
                this.idExpBody.enforceType(TYPE.DICTIONARY, context);
            }
            context.assertIsValidListAccess(this.idExpBody.type, this.idAppendage.type);
            this.type = context.get(this.idExpBody.id).elementType;
        } else if (this.appendageOp === "()") {
            this.idAppendage.analyze(context);
            let entry = context.get(this.idExpBody.id);
            console.log("entry: ", entry);
            if (entry.type !== TYPE.FUNCTION) {
                context.throwNotAFunctionError(this.idExpBody.id);
            }
            if (!canArgumentsFitParameters(this.idAppendage.signature, entry.parameters)) {
                context.throwParameterArgumentMismatchError(this.idExpBody.id, entry.parameters, this.idAppendage.signature);
            }
        }
    }
    enforceType(type, context) {
        console.log(`Enforcing type ${type} for IdExpressionBodyRecursive`);
        if (this.type == "undefined") {
            this.idExpBody.enforceType(type, context);
            this.type = this.idExpBody.type;
        }
    }
    toString(indent = 0) {
        return `${spacer.repeat(indent)}(${this.appendageOp}` +
               `\n${this.idExpBody.toString(++indent)}` +
               `\n${this.idAppendage.toString(indent)}` +
               `\n${spacer.repeat(--indent)})`;
    }
}

class IdExpressionBodyBase {
    constructor(id) {
        this.id = id;
        this.type;
    }
    analyze(context) {
        let entry = context.get(this.id, true);
        this.type = (typeof entry !== "undefined") ? entry.type : "undefined";
    }
    enforceType(type, context) {
        if (this.type === "undefined") {
            this.type = type;
            console.log(`Enforcing type ${type} for id ${this.id}. Set variable.`)
            context.setVariable(this.id, {type: type});
        }
        console.log("enforced type: ", type);
        console.log("get id type: ", context.get(this.id).type);
        if (!canBeA(context.get(this.id).type, type)) {
            console.log("inside base");
            this.context.throwCantResolveTypesError(this.type, type);
        }
    }
    toString(indent = 0) {
        return `${spacer.repeat(indent)}(${this.id})`;
    }
}

class PeriodId {
    constructor(id) {
        this.id = id;
    }
    analyze(context) {

        // TODO: Need to work on more pressing issues so will improve the obviously flawed dictionary access later
        // this.variable.analyze(context);
        // if (this.variable.type == "undefined") {
        //     this.variable.enforceType(TYPE.INTEGER, context);
        // }
        this.type = TYPE.STRING; //this.variable.type;
    }
    getOp() {
        return ".";
    }
    toString(indent = 0) {
        return `${spacer.repeat(indent)}(${this.id.toString(++indent)})`;
    }
}

class Arguments {
    constructor(args) {
        this.args = args;
        this.signature = [];
    }
    analyze(context) {
        let self = this;
        this.args.analyze(context);
        this.signature = this.args.signature;
    }
    getOp() {
        return "()";
    }
    toString(indent = 0) {
        var string = `${spacer.repeat(indent)}(Arguments`;
        if (this.args.length > 0) {
            string += `\n${this.args.toString(++indent)}` +
                      `\n${spacer.repeat(--indent)})`;
        } else {
          string += `)`
        }
        return string;
    }
}

class IdSelector {
    constructor(variable) {
        this.variable = variable;
        this.type;
    }
    analyze(context) {
        this.variable.analyze(context);
        if (this.variable.type == "undefined") {
            this.variable.enforceType(TYPE.INTEGER, context);
        }
        this.type = this.variable.type;
    }
    getOp() {
        return "[]";
    }
    toString(indent = 0) {
        return `${this.variable.toString(indent)}`;
    }
}

class List {
    constructor(varList) {
        this.varList = varList;
        this.type = TYPE.LIST;
        this.elementType;
    }
    analyze(context) {
        let self = this;
        this.varList.analyze(context);
        this.elementType = this.varList.elementType;
    }
    toString(indent = 0) {
        var string = `${spacer.repeat(indent)}(List`;
        if (this.varList.length > 0) {
            string += `\n${this.varList.toString(++indent)}` +
                      `\n${spacer.repeat(--indent)})`;
        } else {
            string += `)`;
        }
        return string;
    }
}

class Tuple {
    constructor(elems) {
        this.elems = elems;
        this.type = TYPE.TUPLE
        this.elementType;
    }
    analyze(context) {
        let self = this;
        this.elems.analyze(context);
        this.elementType = this.elems.elementType;
    }
    toString(indent = 0) {
        return `${spacer.repeat(indent)}(Tuple` +
               `\n${this.elems.toString(++indent)}` +
               `\n${spacer.repeat(--indent)})`;
    }
}

class Dictionary {
    constructor(idValuePairs) {
        this.idValuePairs = idValuePairs;
        this.type = TYPE.DICTIONARY
        // TODO: NEED AN ELEMENT TYPE (KEY VAL PAIR)
    }
    analyze() {
        // TODO
    }
    toString(indent = 0) {
        var string = `${spacer.repeat(indent++)}(Dictionary`
        if (this.idValuePairs.length !== 0) {
            for (var pairIndex in this.idValuePairs) {
                string += `\n${this.idValuePairs[pairIndex].toString(indent)}`;
            }
            string += `\n${spacer.repeat(--indent)})`;
        } else {
          string += `)`;
        }
        return string;
    }
}

class IdValuePair {
    constructor(id, variable) {
        this.id = id;
        this.variable = variable;
    }
    analyze() {
        // TODO
    }
    toString(indent = 0) {
        return `${spacer.repeat(indent)}(${this.id} : ${this.variable.toString()})`;
    }
}

class VarList {
    constructor(variables) {
        this.variables = variables;
        this.length = variables.length;
        this.signature = [];
        this.elementType;
    }
    analyze(context) {
        let self = this;
        this.variables.forEach(function(variable) {
            variable.analyze(context);
            self.signature.push(variable.type)
        });
        if (this.variables[0]) {  // This is horrendous code but we're running out of time
            this.elementType = this.variables[0].type;
        }
    }
    toString(indent = 0) {
        var string = `${spacer.repeat(indent++)}(VarList`;
        if (this.variables.length !== 0) {
            for (var variable in this.variables) {
                string += `\n${this.variables[variable].toString(indent)}`
            }
            string += `\n${spacer.repeat(--indent)})`;
        } else {
          string += `)`;
        }
        return string;
    }
}

class IntLit {
    constructor(digits) {
        this.digits = digits;
        this.type = TYPE.INTEGER;
    }
    analyze() {
        // TODO
    }
    toString(indent = 0) {
        return `${spacer.repeat(indent)}(${this.digits})`;
    }
}

class FloatLit {
    constructor(value) {
        this.value = value;
        this.type = TYPE.FLOAT;
    }
    analyze() {
        // TODO
    }
    toString(indent = 0) {
        return `${spacer.repeat(indent)}(${this.value})`;
    }
}

class StringLit {
    constructor(value) {
        this.value = value.substring(1, value.length - 1);
        this.type = TYPE.STRING;
    }
    analyze() {
        // TODO
    }
    toString(indent = 0) {
        return `${spacer.repeat(indent)}(${this.value})`;
    }
}

class BoolLit {
    constructor(boolVal) {
        this.boolVal = boolVal;
        this.type = TYPE.BOOLEAN;
    }
    analyze() {
        // TODO
    }
    toString(indent = 0) {
        return `${spacer.repeat(indent)}(${this.boolVal})`;
    }
}

class NullLit {
    constructor() {
        this.type = TYPE.NULL
    }
    analyze() {
        // TODO
    }
    toString(indent = 0) {
        return `${spacer.repeat(indent)}(null)`;
    }
}

class IdVariable {
    constructor(value) {
        this.value = value;
    }
    analyze() {
        // TODO
    }
    toString(indent = 0) {
        return `${spacer.repeat(indent)}(\n${this.value})`;
    }
}

class ConstId {
    constructor(firstWord, rest) {
        this.words = firstWord;
        this.rest = rest;
    }
    analyze() {
        // TODO
    }
    toString(indent = 0) {
        var string = `${spacer.repeat(indent)}(\n${this.firstWord.toString()}`;
        for (var char in this.rest) {
            string += `\n${this.rest[char].toString()}`
        }
        string += ")"
        return string;
    }
}

class ClassId {
    constructor(className, rest) {
        this.className = className;
        this.rest = rest;
    }
    analyze() {
        // TODO
    }
    toString(indent = 0) {
        var string = `${spacer.repeat(indent)}(\n${this.className.toString()}`
        for (var char in this.rest) {
            string += `\n${this.rest[char].toString()}`
        }
        string += ")"
        return string;
    }
}

module.exports = {
    Program: Program,
    Block: Block,
    BranchStatement: BranchStatement,
    FunctionDeclarationStatement: FunctionDeclarationStatement,
    ClassDeclarationStatement: ClassDeclarationStatement,
    MatchStatement: MatchStatement,
    BranchStatement: BranchStatement,
    WhileStatement: WhileStatement,
    ForInStatement: ForInStatement,
    PrintStatement: PrintStatement,
    AssignmentStatement: AssignmentStatement,
    IdentifierStatement: IdentifierStatement,
    ReturnStatement: ReturnStatement,
    MatchExpression: MatchExpression,
    Match: Match,
    Parameter: Parameter,
    BinaryExpression: BinaryExpression,
    UnaryExpression: UnaryExpression,
    ParenthesisExpression: ParenthesisExpression,
    Variable: Variable,
    IdExpression: IdExpression,
    IdExpressionBodyRecursive: IdExpressionBodyRecursive,
    IdExpressionBodyBase: IdExpressionBodyBase,
    PeriodId: PeriodId,
    Arguments: Arguments,
    IdSelector: IdSelector,
    List: List,
    Tuple: Tuple,
    Dictionary: Dictionary,
    IdValuePair: IdValuePair,
    VarList: VarList,
    BoolLit: BoolLit,
    IntLit: IntLit,
    FloatLit: FloatLit,
    StringLit: StringLit,
    NullLit: NullLit,
    IdVariable: IdVariable,
    // constId: constId,
    ConstId: ConstId,
    ClassId: ClassId,
    Types: TYPE
};