module.exports.getAst = function() {
    return `(Program
  (Block
    (Class
      (id Ball)
      (Block
        (Func
          (id Ball)
          (Parameters
            (id radius)
            (id weight, default (1.0))
          )
          (Block
            (=
              (IdExpression
                (.
                  (this)
                  (radius)
                )
              )
              (IdExpression
                (IdVariable
                  (radius)
                )
              )
            )
            (=
              (IdExpression
                (.
                  (this)
                  (weight)
                )
              )
              (IdExpression
                (IdVariable
                  (weight)
                )
              )
            )
          )
        )
        (Func
          (id is_round)
          (Parameters)
          (Block
            (Return
              (true)
            )
          )
        )
      )
    )
  )
)`;
};
