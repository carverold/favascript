module.exports.getOptimized = function() {
    return `(Program
  (Block
    (While
      (Condition
        (true)
      )
      (Body
        (Block
          (Print
            (true)
          )
        )
      )
    )
  )
)`;
}
