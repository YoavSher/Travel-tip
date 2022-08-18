
export const utilService = {
  makeId,
}



function makeId(length) {
  var text = ''
  var possible = '123456789'

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

function setColors() {
  const userData = loadFromStorage('userData')
  if (userData && userData.colors) {
    const { bgColor, txtColor } = userData.colors
    document.body.style.backgroundColor = bgColor
    document.body.style.color = txtColor
  } else {
    document.body.style.backgroundColor = '#ffffff'
    document.body.style.color = '#000000'
  }
}
