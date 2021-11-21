const error = (error, req, res, next) => {
  resolveId(error)
  switch (error.id) {
    case 1:
      res.status(400).send(`${error.prop} is missing!`)
      break
    case 2:
      res.status(404).send(`No user found with ${error.email}!`)
      break
    case 3:
      res.status(400).send(`Syntax Error!`)
      break
    default:
      res.send('Something went wrong!')
      break
  }
}

const resolveId = (error) => {
  switch (error.name) {
    case 'SyntaxError':
      error.id = 3
      break
    default:
      break
  }
  return error
}

export default error
