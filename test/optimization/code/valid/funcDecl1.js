module.exports.getOptimized = function() {
    return `(Program
  (Block
    (Func
      (id multiply)
      (Parameters
        (id x)
        (id y, default (2))
        (id z, default (4))
      )
      (Block
        (Return
          (*
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
