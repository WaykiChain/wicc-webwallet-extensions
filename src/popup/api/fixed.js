export default function (value, precision = 2) {
  if (typeof value === 'undefined') return ''
  let result = (+value).toFixed(precision)
  if (result.match(/\./)) {
    result = result.replace(/\.?0+$/, '')
  }
  return result
}
