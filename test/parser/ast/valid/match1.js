module.exports.getAst = function() {
    return `(Program
  (Block
    (Match Expression
      (IdExpression
        (x)
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
