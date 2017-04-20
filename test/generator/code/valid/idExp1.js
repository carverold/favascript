module.exports.getJSCode = function() {
    return `(Program
  (Block
    (Identifier Statement
      (IdExpression
        (()
          (.
            (console)
            (log)
          )
          (Arguments
            (VarList
              (1)
              (hello, world!)
              (true)
              (3.14)
            )
          )
        )
      )
    )
  )
)`;
}
