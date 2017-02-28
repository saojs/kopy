import inquirer from 'inquirer'

export default function ask(data, prompts) {
  return (files, metalsmith, done) => {
    if (prompts) {
      inquirer.prompt(prompts)
        .then(answers => {
          const merged = Object.assign({}, data, answers)

          // prevent from ReferenceErrors
          for (const prompt of prompts) {
            if (!Object.prototype.hasOwnProperty.call(merged, prompt.name)) {
              merged[prompt.name] = undefined
            }
          }

          metalsmith.metadata({data, answers, merged})
          done()
        })
        .catch(done)
    } else if (data) {
      metalsmith.metadata({data, merged: data})
      done()
    } else {
      metalsmith.metadata({merged: {}})
      done()
    }
  }
}
