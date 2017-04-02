module.exports.getAst = function() {
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
