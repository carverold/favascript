module.exports.getAst = function() {
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
              (hello, world!)
            )
          )
        )
      )
    )
  )
)`;
}
