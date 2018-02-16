
function shuffle(
  arr,
  blockSize = 1
) {
  let len = arr.length
  if (len % blockSize !== 0) {throw 'bad blockSize'}
  let i = len - blockSize
  let temp = new Float32Array(blockSize)
  for (; i > 0; i -= blockSize) {
    let r = Math.floor(Math.random() * (i / blockSize + 1)) * blockSize

    if (i === r) { continue }

    // copy r to temp
    temp.set(arr.subarray(r, r + blockSize))

    // copy i to r
    arr.copyWithin(r, i, i + blockSize)

    // copy temp to i
    arr.set(temp, i)
  }

  return arr
}

function interleave(
  arr,
  blockSize = 1,
  random = false
) {
  let next
  if (random instanceof Function) {
    next = random
  } if (random) {
    next = () => Math.floor(Math.random() * arr.length)
  } else {
    let i = 0
    next = () => {
      let key = i
      i = (i + 1) % arr.length
      return key
    }
  }

  let indices = new Uint32Array(arr.length)
  let total = arr.map(a => a.length).reduce((a, v) => a + v)
  let res = new Float32Array(total)
  let index = 0

  while (indices.reduce((a, v) => a + v) < total) {
    let key = next()
    let indice = indices[key]
    if (indice >= arr[key].length) { continue }

    // copy arr[key] to res
    res.set(arr[key].subarray(indice, indice + blockSize), index)

    indices[key] += blockSize
    index += blockSize
  }

  return res
}

function makeOutput(
  keys,
  labels
) {
  let res = new Float32Array(keys.length * labels)

  for (var i = 0; i < keys.length; i++) {
    res[i * labels + keys[i]] = 1
  }

  return res
}

module.exports = shuffleData => {
  let test = [
    new Float32Array(require('./test/0.json')),
    new Float32Array(require('./test/1.json')),
    new Float32Array(require('./test/2.json')),
    new Float32Array(require('./test/3.json')),
    new Float32Array(require('./test/4.json')),
    new Float32Array(require('./test/5.json')),
    new Float32Array(require('./test/6.json')),
    new Float32Array(require('./test/7.json')),
    new Float32Array(require('./test/8.json')),
    new Float32Array(require('./test/9.json'))
  ]
  console.log('loaded tests', test.reduce((a, v) => a + v.length / 784, 0));

  let training = [
    new Float32Array(require('./training/0.json')),
    new Float32Array(require('./training/1.json')),
    new Float32Array(require('./training/2.json')),
    new Float32Array(require('./training/3.json')),
    new Float32Array(require('./training/4.json')),
    new Float32Array(require('./training/5.json')),
    new Float32Array(require('./training/6.json')),
    new Float32Array(require('./training/7.json')),
    new Float32Array(require('./training/8.json')),
    new Float32Array(require('./training/9.json'))
  ]

  console.log('loaded trainings', training.reduce((a, v) => a + v.length / 784, 0));

  if (shuffleData) {
    training.forEach((a, i) => {
      shuffle(a)
      console.log(`shuffled training digit ${i}`)
    })
  }

  let trainingKeys = interleave(training.map((a, i) => new Float32Array(a.length / 784).fill(i)), 1, false)
  let testKeys = interleave(test.map((a, i) => new Float32Array(a.length / 784).fill(i)), 1, false)

  console.log(trainingKeys, testKeys);

  let trainI = 0
  let nextTraining = () => trainingKeys[trainI++]
  let testI = 0
  let nextTest = () => testKeys[testI++]

  let testDataIn = interleave(test, 784, false)
  let testDataOut = makeOutput(testKeys, 10)
  console.log('interleaved test data')

  let trainDataIn = interleave(training, 784, false)
  let trainDataOut = makeOutput(trainingKeys, 10)
  console.log('interleaved training data')

  return (trainNum, testNum) => {
    return {
      training: {
        input: {
          data: trainDataIn.subarray(0, trainNum * 784),
          shape: [trainNum * 784, 784]
        },
        output: {
          data: trainDataOut.subarray(0, trainNum * 10),
          shape: [trainNum * 10, 10]
        }
      },
      test: {
        input: {
          data: testDataIn.subarray(0, testNum * 784),
          shape: [testNum * 784, 784]
        },
        output: {
          data: testDataOut.subarray(0, testNum * 10),
          shape: [testNum * 10, 10]
        }
      },
      draw(img, perd, label) {
        // images are 28x28 but terminal windows are 80x24
        // we will draw the images 56x28
        // as the line hight is roughly double the char width
        let str = ''
        for (var y = 0; y < 28; y++) {
          for (var x = 0; x < 28; x++) {
            let v = img[y * 28 + x]
            if (v > 0.25) {
              str += '# '
            } else {
              str += '  '
            }
          }

          if (y == 9) {
            str += '  label: ' + label.indexOf(1)
          }

          if (y == 12) {
            str += '  predictions:'
          }

          let p = y - 13

          if (p >= 0 && p < 10) {
            let percent = (100 * perd[p]).toFixed(4)

            str += '  ' + p
            if (percent < 10) {
              str += '     '
            } else if (percent < 100) {
              str += '    '
            } else {
              str += '   '
            }
            str += percent + '%'
          }

          str += '\n'
        }
        console.log(str)
      }
    }
  }
}
