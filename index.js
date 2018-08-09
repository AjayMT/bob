
let fs = require('fs')
let readline = require('readline')

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let dataFile = process.argv[2] || './data.json'
let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'))
let names = Object.keys(Object.values(data)[0])
let filtered = copy(names)
let questions = Object.keys(data)
let insertion = {}

function copy (obj) {
  return JSON.parse(JSON.stringify(obj))
}

function filter (question, response) {
  let removed = []

  for (let i = 0; i < filtered.length; i++)
    if (data[question][filtered[i]] !== response)
      removed.push(filtered[i])

  for (let i = 0; i < removed.length; i++)
    filtered.splice(filtered.indexOf(removed[i]), 1)

  if (filtered.length > 1 && questions.length === 0) {
    console.log('ERR ' + filtered.join(' ') + ' are identical')
    differentiate()
    return
  }

  if (filtered.length > 1) ask()
  else if (filtered.length === 0) {
    console.log('ERR none found')
    append()
  } else end()
}

function calcDiff (question) {
  let ntrue = 0

  for (let i = 0; i < filtered.length; i++)
    if (data[question][filtered[i]]) ntrue++

  return Math.abs(ntrue - (filtered.length - ntrue))
}

function popQuestion () {
  let minIndex = 0

  for (let i = 0; i < questions.length; i++)
    if (calcDiff(questions[i]) < calcDiff(questions[minIndex]))
      minIndex = i

  return questions.splice(minIndex, 1)[0]
}

function ask () {
  let q = popQuestion()

  rl.question(q + ' ', (answer) => {
    answer = answer === 'y'
    insertion[q] = answer
    filter(q, answer)
  })
}

function end () {
  console.log(filtered[0])

  rl.question('Correct? ', (answer) => {
    if (answer === 'y') rl.close()
    else append()
  })
}

function differentiate () {
  rl.question('Question: ', (question) => {
    rl.question('Answer for ' + filtered[0] + ': ', (answer) => {
      answer = answer === 'y'

      if (!(question in data)) {
        data[question] = copy(Object.values(data)[0])

        for (person in data[question]) data[question][person] = (! answer)
      }

      data[question][filtered[0]] = answer
      for (let i = 1; i < filtered.length; i++)
        data[question][filtered[i]] = (! answer)

      fs.writeFileSync(dataFile, JSON.stringify(data))
      rl.close()
    })
  })
}

function append () {
  rl.question('Name: ', (name) => {
    for (q in data) {
      if (names.indexOf(name) === -1)
        data[q][name] = insertion[q] || false
      else
        data[q][name] = insertion[q] === undefined ? data[q][name] : insertion[q]
    }

    rl.question('Question: ', (question) => {
      rl.question('Answer: ', (answer) => {
        answer = answer === 'y'

        if (!(question in data) && question) {
          data[question] = copy(Object.values(data)[0])

          for (person in data[question]) data[question][person] = (! answer)
        }

        if (question) data[question][name] = answer

        fs.writeFileSync(dataFile, JSON.stringify(data))
        rl.close()
      })
    })
  })
}

ask()
