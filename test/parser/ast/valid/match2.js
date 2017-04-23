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
              (Return
                (truth)
              )
            )
          )
          (Match
            _ ->
            (Block
              (Return
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
