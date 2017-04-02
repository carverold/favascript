module.exports.getAst = function() {
    return `(Program
  (Block
    (=
      (IdExpression
        (x)
      )
      (/
        (*
          (+
            (2)
            (3)
          )
          (^
            (-
              (6)
              (1)
            )
            (2)
          )
        )
        (4)
      )
    )
  )
)`;
};
