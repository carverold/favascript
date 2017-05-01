module.exports.getOptimized = function() {
    return `(Program
  (Block
    (Func
      (id f)
      (Parameters
        (id x)
        (id y)
      )
      (Block
        (Print
          (IdExpression
            (IdVariable
              (x)
            )
          )
        )
        (Print
          (IdExpression
            (IdVariable
              (x)
            )
          )
        )
        (Print
          (-
            (IdExpression
              (IdVariable
                (x)
              )
            )
            (2)
          )
        )
        (Print
          (-
            (IdExpression
              (IdVariable
                (y)
              )
            )
            (3)
          )
        )
        (Print
          (-
            (IdExpression
              (IdVariable
                (x)
              )
            )
          )
        )
      )
    )
  )
)`;
}
