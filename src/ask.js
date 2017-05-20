import inquirer from 'inquirer'

export default function ask(data, prompts) {
  return ctx => {
    if (prompts) {
      return inquirer.prompt(prompts)
        .then(answers => {
          data = typeof data === 'function' ? data(answers) : data
          const merged = Object.assign({}, data, answers)

          // prevent from ReferenceErrors
          for (const prompt of prompts) {
            if (!Object.prototype.hasOwnProperty.call(merged, prompt.name)) {
              merged[prompt.name] = undefined
            }
          }

          ctx.meta = { data, answers, merged }
        })
    }

    if (data) {
      ctx.meta = { data, merged: data }
    } else {
      ctx.meta = { merged: {} }
    }
  }
}
