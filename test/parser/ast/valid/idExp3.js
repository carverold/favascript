module.exports.getAst = function() {
    return `(Program
  (Block
    (=
      (IdExpression
        ([]
          (.
            (this)
            (dict)
          )
          (IdExpression
            (IdVariable
              (id)
            )
          )
        )
      )
      (IdExpression
        (IdVariable
          (value)
        )
      )
    )
  )
)`;
}
