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
    expressionIsNotTypeBoolean(receivedType) {
        return `ExpressionIsNotTypeBoolean error: expression is type ${receivedType} but must be type BOOLEAN`;
    },
    unusedLocalVariable(id) {
        return `UnusedLocalVariable error: local variable ${id} is declared but never used`;
    },
    returnOutsideFunction() {
        return `ReturnOutsideFunction error: found a return statement outside of a function`;
    },
    multipleReturnsInABlock() {
        return `MultipleReturnsInABlock error: found more than one return statement in a block`;
    },
    cantResolveTypes(receivedType, dominantType) {
        return `CantResolveTypes error: cannot cast a ${receivedType} to a ${dominantType}`;
    },
    invalidAccessType(collectionType, receivedAccessorType, expectedAccessorType) {
        return `InvalidAccessType error: cannot use ${receivedAccessorType} to access ` +
            `${collectionType}. Expected ${expectedAccessorType}`;
    },
    noClassConstructor(id) {
        return `NoClassConstructor error: did not find a constructor in class ${id}`;
    },
    useBeforeDeclaration(id) {
        return `useBeforeDeclaration error: tried to use ${id} before it was declared`;
    },
    invalidMatchType(matcherType, matchVarType) {
        return `InvalidMatchType error: can't match ${matcherType} with ${matchVarType}`;
    },
    nonHomogenousTypes(expectedType, receivedType) {
        return `NonHomogenousTypes error: expected element of type ${receivedType} to be of type ${expectedType}`;
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

    constructor(parent, currentClass, currentFunction, isInLoop, symbolTable) {
        this.parent = parent || null;
        this.currentClass = currentClass;
        this.currentFunction = currentFunction || null;
        this.isInLoop = isInLoop;
        this.symbolTable = symbolTable || {};
        this.undeclaredParameters = [];
        this.parametersUsedInBody = [];

        // Need Object.create(null) so things like toString are not in this.symbolTable
    }

    createChildContextForBlock() {
        return new Context(this, this.currentClass, this.currentFunction, this.inLoop);
    }

    createChildContextForLoop() {
        return new Context(this, this.currentClass, this.currentFunction, true);
    }

    createChildContextForFunction(currentFunction, isConstructor) {
        if (isConstructor) {
            return new Context(this, this.currentClass, currentFunction, false, this.symbolTable);
        } else {
            return new Context(this, this.currentClass, currentFunction, false);
        }
    }

    createChildContextForClass(currentClass) {
        return new Context(this, currentClass, this.currentFunction, false);
    }

    addUndeclaredParameter(id) {
        this.undeclaredParameters.push(id);
    }

    removeUndeclaredParameter(id) {
        this.undeclaredParameters.splice(this.undeclaredParameters.indexOf(id), 1);
    }

    isUndeclaredParameter(id) {
        return this.undeclaredParameters.indexOf(id) > -1;
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

    assertFunctionIsConstructor(message) {
        if (this.currentFunction !== this.currentClass) {
            throw new Error(message);
        }
    }

    assertReturnInFunction() {
        if (!this.currentFunction) {
            throw new Error(semanticErrors.returnOutsideFunction());
        }
    }

    assertIsFunction(value) {  // eslint-disable-line class-methods-use-this
        if (value.constructor !== ASTClasses.FunctionDeclarationStatement) {
            throw new Error(semanticErrors.isNotAFunction(value.id));
        }
    }

    assertIsTypeBoolean(type) {
        if (type !== "BOOLEAN") {
            throw new Error(semanticErrors.expressionIsNotTypeBoolean(type));
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

    throwCantResolveTypesError(recievedType, dominantType) {
        throw new Error(semanticErrors.cantResolveTypes(recievedType, dominantType))
    }

    throwNotAFunctionError(id) {
        throw new Error(semanticErrors.isNotAFunction(id));
    }

    throwParameterArgumentMismatchError(id, parameterTypeList, argumentTypeList) {
        throw new Error(semanticErrors.parameterArgumentMismatch(id, parameterTypeList, argumentTypeList));
    }

    assertIsValidListAccess(collectionType, accessorType) {
        if (collectionType === "DICTIONARY" && !(accessorType === "STRING")) {
            throw new Error(semanticErrors.invalidAccessType("DICTIONARY", accessorType, "STRING"));
        } else if (collectionType === "LIST" && !(accessorType === "INTEGER")) {
            throw new Error(semanticErrors.invalidAccessType("LIST", accessorType, "INTEGER"));
        }
    }

    throwNoClassConstructorError(id) {
        throw new Error(semanticErrors.noClassConstructor(id));
    }

    throwUseBeforeDeclarationError(id) {
        throw new Error(semanticErrors.useBeforeDeclaration(id));
    }

    assertIsValidMatchVariable(matcherType, matchVarType) {
        if (matcherType !== matchVarType) {
            throw new Error(semanticErrors.invalidMatchType(matcherType, matchVarType));
        }
    }

    assertTypesAreHomogeneous(expectedType, receivedType) {
        if (expectedType !== receivedType) {
            throw new Error(semanticErrors.nonHomogenousTypes(expectedType, receivedType));
        }
    }

    addParameterUsedInBody(id) {
        this.parametersUsedInBody.push(id);
    }

    isParameterUsedInBody(id) {
        return this.parametersUsedInBody.indexOf(id) > -1;
    }

    removeParameterUsedInBody(id) {
        this.parametersUsedInBody.splice(this.parametersUsedInBody.indexOf(id), 1);
    }


    // Use these when a Program is newly created:
    // Context.INITIAL = new Context();  // eslint doesn't like the "." after Context ???

}

module.exports = Context;
