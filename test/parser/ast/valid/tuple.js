module.exports.getAst = function() {
    return `(Program
  (Block
    (=
      (IdExpression
        (IdVariable
          (tuple)
        )
      )
      (Tuple
        (VarList
          (hi)
          (3)
          (true)
        )
      )
    )
  )
)`;
}
