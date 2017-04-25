module.exports.getAst = function() {
    return `(Program
  (Block
    (=
      (IdExpression
        (x)
      )
      (false)
    )
    (Match Expression
      (IdExpression
        (x)
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
