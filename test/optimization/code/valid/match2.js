module.exports.getOptimized = function() {
    return `(Program
  (Block
    (=
      (IdExpression
        (IdVariable
          (x)
        )
      )
      (true)
    )
    (Match Expression
      (IdExpression
        (IdVariable
          (x)
        )
      )
      (Matches
        (Match
          (true) ->
          (Block
            (Print
              (truth)
            )
          )
        )
        (Match
          _ ->
          (Block
            (Print
              (lies)
            )
          )
        )
      )
    )
  )
)`;
}
