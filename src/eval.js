// forked from https://github.com/vuejs/vue-cli/blob/master/lib/eval.js

export default function evalualte(exp, data) {
  /* eslint-disable no-new-func */
  const fn = new Function('data', `with (data) { return ${exp} }`)
  try {
    return fn(data)
  } catch (err) {
    console.error(`Error when evaluating filter condition: ${exp}`)
  }
}
