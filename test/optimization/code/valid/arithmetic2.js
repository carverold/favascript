module.exports.getOptimized = function() {
    // return `let v_0 = (Math.pow(2, (5 / (Math.pow(4, 2)))));`;
    return `(Program
  (Block
    (=
      (IdExpression
        (IdVariable
          (x)
        )
      )
      (2)
    )
  )
)`;
};
