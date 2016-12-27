import inquirer from 'inquirer'

export default function ask(data, prompts) {
  return (files, metalsmith, done) => {
    if (prompts) {
      inquirer.prompt(prompts)
        .then(answers => {
          metalsmith.metadata(Object.assign({}, data, answers))
          done()
        })
        .catch(done)
    } else if (data) {
      metalsmith.metadata(data)
      done()
    } else {
      done()
    }
  }
}
