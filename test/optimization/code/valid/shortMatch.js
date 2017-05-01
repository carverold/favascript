module.exports.getOptimized = function() {
    return `(Program
  (Block
    (=
      (IdExpression
        (IdVariable
          (x)
        )
      )
      (2)
    )
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
