export const validateParams = (params) => {
  for (let key of Object.keys(params)) {
    if (!params[key]) throw { id: 1, prop: key }
  }
}
