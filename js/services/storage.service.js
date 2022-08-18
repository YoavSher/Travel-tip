
export const storageService = {
  saveToStorage,
  loadFromStorage
}


function saveToStorage(key, val) {
  var json = JSON.stringify(val)
  localStorage.setItem(key, json)
}

function loadFromStorage(key) {
  const json = localStorage.getItem(key)
  if (json) {
    const val = JSON.parse(json)
    return val
  }
}
