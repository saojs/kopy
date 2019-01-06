const prompts = require('prompts')
const { fs } = require('majo')
const logger = require('./logger')
const KopyError = require('./KopyError')

module.exports = async (questions, generator) => {
  const cacheData = await readCacheFile(generator)
  const cacheAnswers =
    generator.cacheIdentifier && cacheData[generator.cacheIdentifier]

  if (cacheAnswers) {
    questions = questions.map(q => {
      const answer = cacheAnswers[q.name]
      if (q.cache && answer !== undefined) {
        q.initial = answer
      }
      return q
    })
  }

  const { injectAnswers } = generator.opts

  if (injectAnswers === true) {
    // Use initial values as answers
    logger.warn(
      "We're automatically answering default value to all questions, which may have security implications."
    )
    prompts.inject(await getInitialValues(questions))
  } else if (Array.isArray(injectAnswers)) {
    prompts.inject(await getInitialValues(questions, injectAnswers))
  } else if (typeof injectAnswers === 'object') {
    prompts.inject(
      await getInitialValues(
        questions,
        Object.keys(questions).map(q => {
          return injectAnswers[q.name]
        })
      )
    )
  }

  const answers = await prompts(questions)

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

async function getInitialValues(questions, initialValues) {
  const values = [].concat(initialValues || [])
  for (const [i, q] of questions.entries()) {
    let initial = values[i]
    if (initial === undefined) {
      if (typeof q.initial === 'function') {
        initial = await q.initial(values[i - 1], values, q)
      } else {
        initial = q.initial
      }
    }
    values[i] = inferInitialValue(q, initial)
  }
  return values
}

function inferInitialValue(question, initial) {
  switch (question.type) {
    case 'text':
    case 'password':
    case 'invisible':
    case 'autocomplete': {
      return typeof initial === 'string' ? initial : ''
    }
    case 'list': {
      initial = typeof initial === 'string' ? initial : ''
      return initial.split(question.separator || ',').map(v => v.trim())
    }
    case 'number': {
      return typeof initial === 'number' ? initial : 0
    }
    case 'confirm':
    case 'toggle': {
      return typeof initial === 'boolean' ? initial : true
    }
    case 'select': {
      initial = typeof initial === 'number' ? initial : 0
      const choice = question.choices.find((_, i) => {
        return i === initial
      })
      return choice && choice.value
    }
    case 'multiselect': {
      return question.choices.filter(c => c.selected).map(c => c.value)
    }
    default: {
      throw new KopyError(`Unknown prompt type: ${question.type}`)
    }
  }
}
