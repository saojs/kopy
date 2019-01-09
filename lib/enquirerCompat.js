const Enquirer = require('enquirer')

const enquirer = new Enquirer()

function convertOptions(options) {
  if (options.type === 'list') {
    options.type = 'select'
  } else if (options.type === 'checkbox') {
    options.type = 'multiselect'
  }

  options.limit = options.pageSize

  const prefix = options.prefix || ''
  const suffix = options.suffix || ''
  options.message = prefix + options.message + suffix

  if (typeof options.when === 'function') {
    options.skip = ({ answers }) => options.when(answers)
  }

  return options
}

function createCompatPrompt(questions = []) {
  questions = questions.map(convertOptions)

  enquirer.on('prompt', (prompt, answers) => {
    if (typeof prompt.options.transformer === 'function') {
      prompt.format = input =>
        prompt.options.transformer.call(prompt, input, answers, prompt.options)
    }

    if (typeof prompt.options.filter === 'function') {
      prompt.result = input =>
        prompt.options.filter.call(prompt, input, answers)
    }

    if (typeof prompt.options.default === 'function') {
      prompt.default = () => prompt.options.default.call(prompt, answers)
    }

    if (typeof prompt.options.message === 'function') {
      prompt.message = () => prompt.options.message.call(prompt, answers)
    }

    if (typeof prompt.options.validate === 'function') {
      prompt.validate = (input, state) =>
        prompt.options.validate.call(prompt, input, answers, state)
    }
  })

  return enquirer.prompt(questions)
}

exports.prompt = createCompatPrompt
exports.enquirer = enquirer
