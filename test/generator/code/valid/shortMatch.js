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
      )
    )
  )
)`;
}
