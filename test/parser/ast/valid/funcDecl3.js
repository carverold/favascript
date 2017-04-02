module.exports.getAst = function() {
    return `(Program
  (Block
    (=
      (IdExpression
        (z)
      )
      (0)
    )
    (Func
      (id computeSomething)
      (Parameters
        (id x)
        (id y)
      )
      (Block
        (=
          (IdExpression
            (z)
          )
          (+
            (IdExpression
              (x)
            )
            (IdExpression
              (y)
            )
          )
        )
      )
    )
  )
)`;
}
