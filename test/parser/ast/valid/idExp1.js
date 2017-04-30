module.exports.getAst = function() {
    return `(Program
  (Block
    (Identifier Statement
      (IdExpression
        (()
          (.
            (IdVariable
              (console)
            )
            (IdVariable
                (log)
              )
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
