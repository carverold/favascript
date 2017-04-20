module.exports.getJSCode = function() {
    return `(Program
  (Block
    (While
      (Condition
        (true)
      )
      (Body
        (Block
          (Return
            (true)
          )
        )
      )
    )
  )
)`;
}
