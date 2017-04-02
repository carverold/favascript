const astClasses = require('../parser.js');

const semanticErrors = {
    changedImmutableType(id, expectedType, receivedType) {
        return `ChangedImmutableType error: tried to change ${id} `
            + `from type ${expectedType} to ${receivedType}`;
    },
    isNotAFunction(id) {
        return `IsNotAFunction error: ${id} is not a function`;
    },
    isNotAList(id) {
        return `IsNotAList error: ${id} is not a list`;
    },
    isNotADictionary(id) {
        return `IsNotADictionary error: ${id} is not a dictionary`;
    },
    invalidBinaryOperands(leftType, op, rightType) {
        return `InvalidBinaryOperands error: ${leftType} and ${rightType} cannot be used with ${op}`;
    },
    invalidUnaryOperand(type, op) {
        return `InvalidUnaryOperand error: ${type} cannot be used with ${op}`;
    },
    parameterArgumentMismatch(id, parameterTypeList, argumentTypeList) {
        return `ParameterArgumentMismatch error: ${id} has signature ${parameterTypeList} `
            + `but was called with signature ${argumentTypeList}`;
    },
    incompleteMatch() {
        return `IncompleteMatch error: match statement is non-exhaustive`;
    },
    expressionIsNotTypeBoolean(exp, receivedType) {
        return `ExpressionIsNotTypeBoolean error: ${exp} is type ${receivedType} but must be type boolean`;
    },
    unusedLocalVariable(id) {
        return `UnusedLocalVariable error: local variable ${id} is declared but never used`;
    },
    returnOutsideFunction() {
        return `ReturnOutsideFunction error: found a return statement outside of a function`;
    },
    multipleReturnsInABlock(){
        return `MultipleReturnsInABlock error: found more than one return statement in a block`;
    }
};

function checkArrayinArray(arrA, arrB) {
    var hash = {};
    for (b in arrB) {
        hash[arrB[b]] = b;
    }
    return hash.hasOwnProperty(arrA);
};

class Context {

    constructor(parent, currentFunction, isInLoop) {
        this.parent = parent || null;
        this.currentFunction = currentFunction || null;
        this.isInLoop = isInLoop;

        // Need Object.create(null) so things like toString are not in this.symbolTable
        this.symbolTable = {};
    }

    createChildContextForBlock() {
        return new Context(this, this.currentFunction, this.inLoop);
    }

    createChildContextForLoop() {
        return new Context(this, this.currentFunction, true);
    }

    createChildContextForFunction(currentFunction) {
        return new Context(this, currentFunction, false);
    }

    setVariable(id, signature) {

        // Case 1- updating the value of a variable within the current scope:
        if (this.symbolTable.hasOwnProperty(id)) {
            // Make sure the new value has the correct type (static typing):
            if (this.symbolTable[id].type === signature.type || signature.type === "NULL") {
                this.symbolTable[id] = signature;
            } else {
                throw new Error(semanticErrors.changedImmutableType(id, this.symbolTable[id].type, signature.type))
            }
        } else {

            // Case 2- either creating a new variable or shadowing an old one:
            this.symbolTable[id] = signature;
        }
    }

    get(id, silent = false, onlyThisContext = false) {
        if (this.symbolTable.hasOwnProperty(id)) {
            return this.symbolTable[id];
        } else if (this.parent === null) {
            return undefined;
        } else {
            if (onlyThisContext) {
                return undefined;
            } else {
                return this.parent.get(id);
            }
        }
    }

    // TODO: Possibly delete this
    assertIsInFunction(message) {
        if (!this.currentFunction) {

            // Use a more specific error message:
            throw new Error(message);
        }
    }

    assertReturnInFunction() {
        if (!this.currentFunction) {
            throw new Error(semanticErrors.returnOutsideFunction());
        }
    }

    assertIsFunction(value) {  // eslint-disable-line class-methods-use-this
        if (value.constructor !== astClasses.FunctionDeclarationStatement) {
            throw new Error(semanticErrors.isNotAFunction(value.id));
        }
    }

    assertIsTypeBoolean(exp) {
        if (!exp.type == "boolean") {
            throw new Error(semanticErrors.expressionIsNotTypeBoolean(exp, exp.type));
        }
    }

    assertUnaryOperandIsOneOfTypes(op, expected, received) {
        if (expected.indexOf(received) === -1) {
            throw new Error(semanticErrors.invalidUnaryOperand(received, op));
        }
    }

    assertBinaryOperandIsOneOfTypePairs(op, expected, received) {
        if (!checkArrayinArray(received, expected)) {
            throw new Error(semanticErrors.invalidBinaryOperands(received[0], op, received[1]));
        }
    }

    declareUnusedLocalVariable(id) {
        throw new Error(semanticErrors.unusedLocalVariable(id));
    }

    throwMultipleReturnsInABlockError() {
        throw new Error(semanticErrors.multipleReturnsInABlock());
    }

    // Use these when a Program is newly created:
    // Context.INITIAL = new Context();  // eslint doesn't like the "." after Context ???

}

module.exports = Context;
