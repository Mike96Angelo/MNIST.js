mnist = require('./mnist')()

let set = mnist(6000, 1000)

console.log(JSON.stringify(set))
