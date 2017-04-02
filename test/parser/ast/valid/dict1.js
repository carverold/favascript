module.exports.getAst = function() {
    return `(Program
  (Block
    (=
      (IdExpression
        (dict)
      )
      (Dictionary
        (x : (5))
        (y : (Hello))
        (z : (true))
      )
    )
  )
)`;
}
