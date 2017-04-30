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
              (hello, world!)
            )
          )
        )
      )
    )
  )
)`;
}
