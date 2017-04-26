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
            (log)
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
