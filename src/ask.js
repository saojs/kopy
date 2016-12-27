import inquirer from 'inquirer'

export default function ask(data, prompts, defaultData) {
  return (files, metalsmith, done) => {
    if (data) {
      metalsmith.metadata(data)
      done()
    } else if (prompts) {
      inquirer.prompt(prompts)
        .then(answers => {
          metalsmith.metadata(Object.assign({}, defaultData, answers))
          done()
        })
        .catch(done)
    } else {
      done()
    }
  }
}
