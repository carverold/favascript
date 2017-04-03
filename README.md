[<img src="https://raw.githubusercontent.com/AnsonAdams/favascript/master/images/Favascript%20logo.png">](https://ansonadams.github.io/favascript/)

## Introduction

Favascript is a strongly and statically typed language that compiles down to Javascript. With type inference, first class functions, and other features, Favascript's goal is to enable a programmer to sketch out ideas quickly without sacrificing focus to lower-level details. For example, the language is designed with a minimalistic approach to reduce the amount of time programmers have to spend typing a worrying about language-specific syntax. Similarly, Favascript incorporates pattern matching and the for-in loop to produce a more intuitive programming language that cuts out unnecessary in-between logic. Favascript takes much inspiration from Python for its expressiveness and high-level abstraction.

## Features
* .fav File Extension
* Curly Braces
* Pattern Matching
* Object-oriented
* First Class Functions
* Higher Order Functions
* Type Inference
* Static Typing
* Strong Typing
* Optional Parameters

### Operators

* Additive: `+`, `-`
* Multiplicative: `*`, `/`, `//`
* Exponentiation: `^`
* Relational: `<`, `>`, `>=`, `<=`, `==`, `!=`
* Boolean: `&&`, `||`

### Data Types

* Int: `4`, `8`, `666`
* Float: `4.0`, `3.1415926`, `0.7734`
* Boolean: `true`, `false`
* String: `“fava”`, `“Don’t throw favas in the lavas”`, `“The fava said, \“I am delicious.\””`
* List (Heterogeneous allowed): `[1, 2, 3, 4, 5]`, `[“I”, 8, 50.4, “favas”]`
* Tuple (Heterogeneous allowed): `(30, 0.5, “fava”)`
* Dictionary: `{key:“value”, bestColor:“fava”, worstLanguage: “php”}`
* Comments: `# Single line comment`

## Example Programs
Favascript on the left, Javascript on the right

__Variable Declarations__

```
name = "fav"                               let name = “fav”
age = 21                                    var age = 21
female = true                               let female = true
```

__Constant Declarations__

```
PI = 3.14159265359                         const PI = 3.14159265359
```

__Arithmetic__

```
x = ((2 + 3) * (6 - 1) ^ 2) / 4            x = ((2 + 3) * Math.pow((6 - 1), 2)) / 4
```

__While Statements__

```
while true {                               while (true) {
   ret true                                   return true
}                                          }
```

__Conditional Statements__

```
x == 2 ? x -= 1 : x += 1                   (x == 2) ? x -= 1 : x += 1
```

__Match Statements__

```
match fruit with                           
    | pear   -> puke.exe()                 if (fruit == pear) { puke.exe(); }
    | apple  -> puke.exe()                 else if (fruit == apple) { puke.exe(); }
    | banana -> puke.exe()                 else if (fruit == banana) { puke.exe(); }
    | fava  -> observe("delicious")       else if (fruit == fava) {
                observe("nutritious")          observe("delicious");
    | _      -> puke.exe()                     observe("nutritious");
                                           } else { puke.exe(); }
```

__Functions__

```
multiply (x, y) {                           var multiply = (x, y) => {
   ret x * y                                   return x * y;
}                                           }
```

```
numbers = [1, 2, 3, 4, 5, 6]                let numbers = [1, 2, 3, 4, 5, 6];
add_even_numbers() {                        add_even_numbers = () => {
    result = 0                                  var result = 0;
    for num in numbers {                            for (var i in numbers) {
        if num % 2 == 0 {                               if (numbers[i] % 2 === 0) {
            result += i                                     result += i;
        }                                               }
    }                                               }
    ret result                                   return result;
}                                            }
```

__Higher-Order Functions__

```
doTwice (f, x) {                            var doTwice = (f, x) => {
   ret f(f(x))                                  return f(f(x));
}                                           }
```

__Class Declarations__

```
class Ball {                                 class Ball {
    Ball (radius, weight = 1.0) {                constructor(radius, weight) {
    	this.radius = radius                         this.radius = radius;
	       this.weight = weight                  this.weight = weight;
    }                                        }
    is_round() {                                 var is_round = () => {
    	ret true                                     return true
    }                                            }
}                                            }

bouncyBall = Ball(0.2)                       let bouncyBall = new Ball(0.2, 1.0);
bouncyBall.is_round()                        bouncyBall.is_round();
```

## Semantic Errors

The following is a list of semantic errors and example output.

* `changedImmutableType` : tried to change x from type INTEGER to STRING
* `isNotAFunction` : f is not a function
* `isNotAList` : l is not a list
* `isNotADictionary` : d is not a dictionary
* `invalidBinaryOperands` : LIST and INTEGER cannot be used with +
* `invalidUnaryOperand` : STRING cannot be used with !
* `parameterArgumentMismatch` : f has signature INT, LIST, FLOAT but was called with signature STRING, LIST, FLOAT
* `expressionIsNotTypeBoolean` : x + 3 is type INTEGER but must be type BOOLEAN
* `unusedLocalVariable` : local variable x is declared but never used
* `useBeforeDeclaration` : tried to use x before it was declared
* `returnOutsideFunction` : found a return statement outside of a function
* `multipleReturnsInABlock` : found more than one return statement in a block
* `cantResolveTypes` : cannot cast a STRING to a FLOAT
* `invalidAccessType` : cannot use OBJECT to access LIST. Expected INTEGER
* `noClassConstructor` : did not find a constructor in class C
