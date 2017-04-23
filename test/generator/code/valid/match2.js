module.exports.getJSCode = function() {
    return `(Program
  (Block
    (=
      (IdExpression
        (y)
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
  )
)`;
}
