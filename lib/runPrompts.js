const { prompt } = require('enquirer')
const { fs } = require('majo')

module.exports = async (questions, generator) => {
  const cacheData = await readCacheFile(generator)
  const cacheAnswers =
    generator.cacheIdentifier && cacheData[generator.cacheIdentifier]

  questions = questions.map(q => {
    if (cacheAnswers) {
      const answer = cacheAnswers[q.name]
      if (q.cache && answer !== undefined) {
        q.initial = answer
      }
    }

    if (generator.opts.test) {
      q.show = false
    }

    // Compability with older version
    if (q.type === 'text' || q.type === undefined) {
      q.type = 'input'
    }

    return q
  })

  if (typeof generator.opts.emulator === 'function') {
    generator.opts.emulator(prompt)
  }

  const answers = await prompt(questions)

  // Restore cursor
  // When using prompt.show enquirer will hide prompts
  // But seems it doesn't restore cursor when finished
  if (generator.opts.test) {
    const stream = process.stdout
    if (stream.isTTY) {
      stream.write('\u001B[?25h')
    }
  }

  for (const q of questions) {
    // In case some questions are skipped
    // We explictly set it to `undefined` to prevent ejs from crashing
    if (answers[q.name] === undefined) {
      answers[q.name] = undefined
    }
  }

  setCacheAnswers(generator, cacheData, answers)

  return answers
}

async function readCacheFile(generator) {
  return fs.existsSync(generator.cacheFile)
    ? JSON.parse(await fs.readFile(generator.cacheFile, 'utf8'))
    : {}
}

async function setCacheAnswers(generator, cacheData, answers) {
  if (!generator.cacheIdentifier) return

  const newData = Object.assign({}, cacheData, {
    [generator.cacheIdentifier]: answers
  })

  await fs.writeFile(generator.cacheFile, JSON.stringify(newData), 'utf8')
}
