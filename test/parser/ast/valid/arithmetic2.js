module.exports.getAst = function() {
    return `(Program
  (Block
    (=
      (IdExpression
        (IdVariable
          (x)
        )
      )
      (^
        (2)
        (/
          (5)
          (^
            (4)
            (2)
          )
        )
      )
    )
  )
)`;
};
