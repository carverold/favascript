module.exports.getOptimized = function() {
    return `(Program
  (Block
    (=
      (IdExpression
        (IdVariable
          (x)
        )
      )
      (1)
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
        (Match
          (3) ->
          (Block
            (Print
              (three)
            )
          )
        )
        (Match
          (4) ->
          (Block
            (Print
              (four)
            )
          )
        )
        (Match
          (5) ->
          (Block
            (Print
              (five)
            )
          )
        )
        (Match
          _ ->
          (Block
            (Print
              (nope)
            )
          )
        )
      )
    )
  )
)`;
}
