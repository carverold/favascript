module.exports.getOptimized = function() {
    return `(Program
  (Block
    (=
      (IdExpression
        (IdVariable
          (dict)
        )
      )
      (Dictionary
        (cat : (meow))
        (dog : (woof))
      )
    )
    (Print
      (IdExpression
        ([]
          (IdVariable
            (dict)
          )
          (cat)
        )
      )
    )
  )
)`;
}
