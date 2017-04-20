module.exports.getJSCode = function() {
    return `(Program
  (Block
    (Match Expression
      (IdExpression
        (x)
      )
      (Matches
        (Match
          (2) ->
          (two)
        )
        (Match
          (3) ->
          (three)
        )
        (Match
          (4) ->
          (four)
        )
        (Match
          (5) ->
          (five)
        )
        (Match
          _ ->
          (nope)
        )
      )
    )
  )
)`;
}
