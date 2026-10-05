const typeMap = {
  text: (answer) => answer.text,
  choice: (answer) => answer.choice.label,
}

module.exports = {
  getAnswerValue(answer) {
    return typeMap[answer.type](answer)
  },
}
