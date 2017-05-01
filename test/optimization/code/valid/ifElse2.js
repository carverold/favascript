// Still needs redoing
module.exports.getOptimized = function() {
    return `(Program
  (Block
    (=
      (IdExpression
        (IdVariable
          (x)
        )
      )
      (true)
    )
    (If
      (Case
        (Condition
          (true)
        )
        (Body
          (Block
            (Print
              (2)
            )
          )
        )
      )
    )
  )
)`;
}
