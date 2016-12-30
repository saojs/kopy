import inquirer from 'inquirer'

export default function ask(data, prompts) {
  return (files, metalsmith, done) => {
    if (prompts) {
      inquirer.prompt(prompts)
        .then(answers => {
          const merged = Object.assign({}, data, answers)
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
