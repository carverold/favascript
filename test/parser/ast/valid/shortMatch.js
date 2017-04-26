module.exports.getAst = function() {
    return `(Program
  (Block
    (Match Expression
      (IdExpression
        (IdVariable
          (x)
        )
      )
      (Matches
        (Match
          (2) ->
          (Block
            (Print
              (two)
            )
          )
        )
      )
    )
  )
)`;
}
