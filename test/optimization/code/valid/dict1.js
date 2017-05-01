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
        (x : (5))
        (y : (4))
        (z : (2))
      )
    )
  )
)`;
}
