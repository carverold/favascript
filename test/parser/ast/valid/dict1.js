module.exports.getAst = function() {
    return `(Program
  (Block
    (=
      (IdExpression
        (IdVariable
          (dict)
        )
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
