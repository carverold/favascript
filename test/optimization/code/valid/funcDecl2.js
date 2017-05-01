module.exports.getOptimized = function() {
    return `(Program
  (Block
    (=
      (IdExpression
        (IdVariable
          (z)
        )
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
            (IdVariable
              (z)
            )
          )
          (+
            (IdExpression
              (IdVariable
                (x)
              )
            )
            (IdExpression
              (IdVariable
                (y)
              )
            )
          )
        )
      )
    )
  )
)`;
}
