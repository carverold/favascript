module.exports.getAst = function() {
    return `(Program
  (Block
    (Class
      (id Test)
      (Block
        (Func
          (id Test)
          (Parameters
            (id param1, default (1))
            (id param2, default (2))
            (id param3, default (false))
            (id param4, default (0))
          )
          (Block
            (=
              (IdExpression
                (.
                  (this)
                  (param1)
                )
              )
              (IdExpression
                (param1)
              )
            )
            (=
              (IdExpression
                (.
                  (this)
                  (param2)
                )
              )
              (IdExpression
                (param2)
              )
            )
            (=
              (IdExpression
                (.
                  (this)
                  (param3)
                )
              )
              (IdExpression
                (param3)
              )
            )
            (=
              (IdExpression
                (.
                  (this)
                  (PARAM4)
                )
              )
              (IdExpression
                (param4)
              )
            )
          )
        )
        (Func
          (id getParam1)
          (Parameters)
          (Block
            (Return
              (IdExpression
                (.
                  (this)
                  (param1)
                )
              )
            )
          )
        )
        (Func
          (id setParam1)
          (Parameters
            (id newParam)
          )
          (Block
            (=
              (IdExpression
                (.
                  (this)
                  (param1)
                )
              )
              (IdExpression
                (newParam)
              )
            )
          )
        )
        (Func
          (id checkIfEqual)
          (Parameters
            (id paramX)
            (id paramY)
          )
          (Block
            (Return
              (==
                (IdExpression
                  (paramX)
                )
                (IdExpression
                  (paramY)
                )
              )
            )
          )
        )
        (Class
          (id Sub)
          (Block
            (Func
              (id Sub)
              (Parameters
                (id x)
                (id y)
                (id z)
              )
              (Block
                (=
                  (IdExpression
                    (.
                      (this)
                      (x)
                    )
                  )
                  (IdExpression
                    (x)
                  )
                )
                (=
                  (IdExpression
                    (.
                      (this)
                      (y)
                    )
                  )
                  (IdExpression
                    (y)
                  )
                )
                (=
                  (IdExpression
                    (.
                      (this)
                      (z)
                    )
                  )
                  (IdExpression
                    (z)
                  )
                )
              )
            )
            (Func
              (id checkVariables)
              (Parameters
                (id var1)
              )
              (Block
                (Identifier Statement
                  (IdExpression
                    (answer)
                  )
                )
                (If
                  (Case
                    (Condition
                      (!=
                        (IdExpression
                          (var1)
                        )
                        (null)
                      )
                    )
                    (Body
                      (Block
                        (Match Expression
                          (IdExpression
                            (var1)
                          )
                          (Matches
                            (Match
                              (1) ->
                              (Block
                                (Print
                                  (one)
                                )
                              )
                            )
                            (Match
                              (2) ->
                              (Block
                                (Print
                                  (two)
                                )
                              )
                            )
                            (Match
                              _ ->
                              (Block
                                (Print
                                  (not one or two)
                                )
                              )
                            )
                          )
                        )
                      )
                    )
                  )
                )
                (Return
                  (IdExpression
                    (answer)
                  )
                )
              )
            )
          )
        )
        (Class
          (id Collections)
          (Block
            (Func
              (id Collections)
              (Parameters
                (id dict)
                (id list)
                (id tup)
              )
              (Block
                (=
                  (IdExpression
                    (.
                      (this)
                      (dict)
                    )
                  )
                  (IdExpression
                    (dict)
                  )
                )
                (=
                  (IdExpression
                    (.
                      (this)
                      (list)
                    )
                  )
                  (IdExpression
                    (list)
                  )
                )
                (=
                  (IdExpression
                    (.
                      (this)
                      (tup)
                    )
                  )
                  (IdExpression
                    (tup)
                  )
                )
              )
            )
            (Func
              (id addToDict)
              (Parameters
                (id id)
                (id value)
              )
              (Block
                (=
                  (IdExpression
                    ([]
                      (.
                        (this)
                        (dict)
                      )
                      (IdExpression
                        (id)
                      )
                    )
                  )
                  (IdExpression
                    (value)
                  )
                )
              )
            )
            (Func
              (id getDict)
              (Parameters
                (id id)
              )
              (Block
                (Return
                  (IdExpression
                    ([]
                      (.
                        (this)
                        (dict)
                      )
                      (IdExpression
                        (id)
                      )
                    )
                  )
                )
              )
            )
            (Func
              (id getTuple)
              (Parameters)
              (Block
                (Return
                  (IdExpression
                    (.
                      (this)
                      (tup)
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  )
)`;
};
