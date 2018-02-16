mnist = require('./mnist')(false)

let set = mnist(6000, 1000)


set.draw(set.training.input.data, [], set.training.output.data)
set.draw(set.test.input.data, [], set.test.output.data)
