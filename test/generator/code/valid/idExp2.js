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
              (hello, world!)
            )
          )
        )
      )
    )
  )
)`;
}
