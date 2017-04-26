module.exports.getAst = function() {
    return `(Program
  (Block
    (=
      (IdExpression
        (IdVariable
          (x)
        )
      )
      (false)
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
