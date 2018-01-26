# MNIST.js
MNIST dataset for NodeJS values are Float32 numbers between `0` and `1` 

```javascript
// if you want the digits to be shuffled before they are randomly interleaved.
// NOTE: shuffling takes more time to load.
const shuffle = false

const mnist = require('mnist')(shuffle)

let trainingSamples = 6000 // upto 60000
let testSamples = 1000 // upto 10000
let dataset = mnist(trainingSamples, testSamples)

dataset.training
// {
//   input: {
//     data: [Float32Array 4704000],
//     shape: [6000, 784]
//   },
//   output: {
//     data: [Float32Array 60000],
//     shape: [6000, 10]
//   }
// }

dataset.test
// {
//   input: {
//     data: [Float32Array 784000],
//     shape: [1000, 784]
//   },
//   output: {
//     data: [Float32Array 10000],
//     shape: [1000, 10]
//   }
// }

```
