# Math Obfuscator

Test it out live: [here](https://basilbenny1002.github.io/math-obscifiucator/)

This project basically converts any simple number into a massive, complex set of equations that mathematically evaluate to the original number. 

## Inspiration

On a Discord server, in the counting channel, I saw a guy using crazy equations to count. I thought maybe I could do that too. But since my two drunk brain cells are bad at math, I decided to code this thing up to do it for me.

## How it works

The core idea relies on mathematical identities and recursion. 

It takes a base number `n` and randomly applies mathematical rules that do not change its overall value. For example, it might swap `n` out for `(n + r - r)` or `(n * (r / r))` where `r` is a random number. 

Depending on the complexity length you choose, the script recursively runs these rules over and over on the newly generated numbers, expanding the equation outward into a dense wall of math.
