module.exports.getJSCode = function() {
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
            (id)
          )
        )
      )
      (IdExpression
        (value)
      )
    )
  )
)`;
}
