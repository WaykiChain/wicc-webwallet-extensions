export default function (error) {
  if (!error) return ''

  if (error.message) {
    return error.message
  }

  return JSON.stringify(error)
}
