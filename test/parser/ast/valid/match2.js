module.exports.getAst = function() {
    return `(Program
  (Block
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
