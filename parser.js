const fs = require('fs');
const ohm = require('ohm-js');
const grammarContents = fs.readFileSync('favascript.ohm');
const grammar = ohm.grammar(grammarContents);
const ASTClasses = require('./ast.js');

function unpack(elem) {
    elem = elem.ast();
    elem = Array.isArray(elem) ? elem : [elem];
    return elem.length === 0 ? null : elem[0];
}

function joinParams(parameter, parameters) {
    parameter = Array.isArray(parameter.ast()) ? parameter.ast() : [parameter.ast()];
    if (unpack(parameters) !== null) {
        return parameter.concat(unpack(parameters));
    }
    return parameter;
}

// Favascript CST -> AST
semantics = grammar.createSemantics().addOperation('ast', {
    Program(block) {return new ASTClasses.Program(block.ast());},
    Block(statements) {return new ASTClasses.Block(statements.ast());},
    Statement_conditional(exp, question, ifBlock, colon, elseBlock) {
      return new ASTClasses.BranchStatement([exp.ast()], [ifBlock.ast()], unpack(elseBlock));},
    Statement_funcDecl(id, lParen, parameter1, commas, parameterArray, rParen, lCurly, block, rCurly) {
      return new ASTClasses.FunctionDeclarationStatement(id.sourceString, joinParams(parameter1, parameterArray), block.ast());},
    Statement_classDecl(clas, id, lCurly, block, rCurly) {
      return new ASTClasses.ClassDeclarationStatement(id.sourceString, block.ast());},
    Statement_match(matchExp) {return new ASTClasses.MatchStatement(matchExp.ast());},
    Statement_ifElse(i, ifExp, lCurly1, ifBlock, rCurly1, elif, exps, lCurly2, blocks, rCurly2, els, lCurly3, elseBlock, rCurly3) {
      return new ASTClasses.BranchStatement(joinParams(ifExp, exps), joinParams(ifBlock, blocks), unpack(elseBlock));},
    Statement_while(whil, exp, lCurly, block, rCurly) {return new ASTClasses.WhileStatement(exp.ast(), block.ast());},
    Statement_forIn(fo, id, iN, iDExp, lCurly, block, rCurly) {
      return new ASTClasses.ForInStatement(id.sourceString, iDExp.ast(), block.ast());},
    Statement_print(print, lCurly, exp, rCurly) {return new ASTClasses.PrintStatement(exp.ast());},
    Statement_assign(idExp, assignOp, exp) {
      return new ASTClasses.AssignmentStatement(idExp.ast(), assignOp.sourceString, exp.ast());},
    Statement_identifier(iDExp) {return new ASTClasses.IdentifierStatement(iDExp.ast());},
    Statement_return(ret, exp) {return new ASTClasses.ReturnStatement(exp.ast());},
    MatchExp(matchStr, idExp, wit, line1, var1, match1, lines, varArray, matchArray, lineFinal, _, matchFinal) {
        return new ASTClasses.MatchExpression(idExp.ast(), [var1.ast()].concat(varArray.ast()), [match1.ast()].concat(matchArray.ast()), matchFinal.ast());},
    Match (arrow, matchee) {return new ASTClasses.Match(matchee.ast())},
    Param(id, equals, variable) {return new ASTClasses.Parameter(id.sourceString, unpack(variable))},
    Exp_reg(left, op, right) {return new ASTClasses.BinaryExpression(left.ast(), op.sourceString, right.ast());},
    Exp_pass(otherExp) {return otherExp.ast();},
    BoolAndExp_reg(left, op, right) {return new ASTClasses.BinaryExpression(left.ast(), op.sourceString, right.ast());},
    BoolAndExp_pass(otherExp) {return otherExp.ast()},
    RelExp_reg(left, op, right) {return new ASTClasses.BinaryExpression(left.ast(), op.sourceString, right.ast());},
    RelExp_pass(otherExp) {return otherExp.ast();},
    AddExp_reg(left, op, right) {return new ASTClasses.BinaryExpression(left.ast(), op.sourceString, right.ast());},
    AddExp_pass(otherExp) {return otherExp.ast();},
    MulExp_reg(left, op, right) {return new ASTClasses.BinaryExpression(left.ast(), op.sourceString, right.ast());},
    MulExp_pass(otherExp) {return otherExp.ast();},
    ExponExp_reg(base, op, exponent) {return new ASTClasses.BinaryExpression(base.ast(), op.sourceString, exponent.ast());},
    ExponExp_pass(otherExp) {return otherExp.ast();},
    PrefixExp_reg(prefixOp, exp) {return new ASTClasses.UnaryExpression(prefixOp.sourceString, exp.ast());},
    PrefixExp_pass(otherExp) {return otherExp.ast();},
    ParenExp_reg(left, exp, right) {return new ASTClasses.ParenthesisExpression(exp.ast());},
    ParenExp_pass(variable) {return new ASTClasses.Variable(variable.ast());},
    Var(input) {return new ASTClasses.Variable(input.ast());},

    IdExp(idExpBody, idPostOp) {return new ASTClasses.IdExpression(idExpBody.ast(), unpack(idPostOp));},
    IdExpBody_recursive(idExpBody, selector) {return new ASTClasses.IdExpressionBodyRecursive(idExpBody.ast(), selector.ast());},
    IdExpBody_base(id) {return new ASTClasses.IdExpressionBodyBase(id.sourceString);},
    periodId(period, id) {return new ASTClasses.PeriodId(id.sourceString);},
    Arguments(lParen, args, rParen) {return new ASTClasses.Arguments(args.ast());},
    IdSelector(lBracket, variable, rBracket) {return new ASTClasses.IdSelector(variable.ast());},
    idPostOp(op) {return op},
    List(lBracket, list, rBracket) {return new ASTClasses.List(list.ast());},
    Tuple(lParen, tuple, rParen) {return new ASTClasses.Tuple(tuple.ast());},
    Dictionary(lBrace, IdValuePair, commas, IdValuePairs, rBrace) {
        return new ASTClasses.Dictionary(joinParams(IdValuePair, IdValuePairs));},
    IdValuePair(id, colon, variable) {return new ASTClasses.IdValuePair(id.sourceString, variable.ast());},
    VarList(firstElem, commas, restElems) {return new ASTClasses.VarList(joinParams(firstElem, restElems));},
    orOp(operator) {return operator;},
    andOp(operator) {return operator;},
    exponOp(operator) {return operator;},
    assignOp(operator) {return operator;},
    addOp(operator) {return operator;},
    mulOp(operator) {return operator;},
    relOp(operator) {return operator;},
    prefixOp(operator) {return operator;},
    boolLit(boolVal) {return new ASTClasses.BoolLit(boolVal.sourceString);},
    intLit(digits) {return new ASTClasses.IntLit(this.sourceString);},
    floatLit(digits1, period, digits2) {return new ASTClasses.FloatLit(this.sourceString);},
    stringLit(lQuote, content, rQuote) {return new ASTClasses.StringLit(this.sourceString)},
    nullLit(nul) {return new ASTClasses.NullLit()},
    keyword(word) {return word;},
    id_variable(firstChar, rest) {return new ASTClasses.IdVariable(this.sourceString);},
    // id_constant(constId) {return new ASTClasses.constId(this.sourceString)},                  //TODO: fix constID
    idrest(character) {return character},
    constId(underscores, words) {return new ASTClasses.ConstId(words)},
    classId(upper, idrests) {return new ASTClasses.ClassId(idrests.ast())}
});

module.exports = (program) => {
  match = grammar.match(program);
  if(match.succeeded()) {
      return semantics(match).ast();
  } else {
    console.log(match.message);
  }
}
