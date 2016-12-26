import inquirer from 'inquirer'

export default function ask(data, prompts) {
  return (files, metalsmith, done) => {
    if (data) {
      metalsmith.metadata(data)
      done()
    } else if (prompts) {
      inquirer.prompt(prompts)
        .then(answers => {
          metalsmith.metadata(answers)
          done()
        })
        .catch(done)
    } else {
      done()
    }
  }
}
