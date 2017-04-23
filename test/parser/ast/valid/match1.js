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
            (Return
              (two)
            )
          )
        )
        (Match
          (3) ->
          (Block
            (Return
              (three)
            )
          )
        )
        (Match
          (4) ->
          (Block
            (Return
              (four)
            )
          )
        )
        (Match
          (5) ->
          (Block
            (Return
              (five)
            )
          )
        )
        (Match
          _ ->
          (Block
            (Return
              (nope)
            )
          )
        )
      )
    )
  )
)`;
}
