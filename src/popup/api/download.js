export default function (filename, content) {
  const linkEl = document.createElement('a')
  const blob = new Blob([content], { type: 'text/plain;charset=UTF-8' })
  linkEl.href = window.URL.createObjectURL(blob)
  linkEl.download = filename
  linkEl.style.display = 'none'
  document.body.appendChild(linkEl)
  linkEl.click()
  document.body.removeChild(linkEl)
}
