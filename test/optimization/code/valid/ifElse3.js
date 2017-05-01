// Still needs redoing
module.exports.getOptimized = function() {
    return `(Program
  (Block
    (Func
      (id f)
      (Parameters
        (id n)
      )
      (Block
        (If
          (Case
            (Condition
              (>
                (IdExpression
                  (IdVariable
                    (n)
                  )
                )
                (5)
              )
            )
            (Body
              (Block
                (Return
                  (true)
                )
              )
            )
          )
          (Else
            (Block
              (Return
                (false)
              )
            )
          )
        )
      )
    )
  )
)`;
}
