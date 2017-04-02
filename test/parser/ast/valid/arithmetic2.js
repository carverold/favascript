module.exports.getAst = function() {
    return `(Program
  (Block
    (=
      (IdExpression
        (x)
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
