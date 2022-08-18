import { locService } from './loc.service.js'
import { storageService } from './storage.service.js'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    debounce,
    moveTo
}

// Var that is used throughout this Module (not global)
var gMap
let gMarker
let gLocations = storageService.loadFromStorage('locsDB') || []

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi().then(() => {
        console.log('google available')
        gMap = new google.maps.Map(document.querySelector('#map'), {
            center: { lat, lng },
            zoom: 15
        })
        console.log('Map!', gMap)

        gMap.addListener('click', (mapsMouseEvent) => {
            const lat = mapsMouseEvent.latLng.lat()
            const lng = mapsMouseEvent.latLng.lng()
            const position = { lat, lng }
            // console.log('position:', position)
            // const name = prompt('Location name?')
            const newLoc = locService.createNewLoc(
                position.lat,
                position.lng,
                // name
            )
            locService.addNewLoc(position)
            locService.showWeather(position.lat, position.lng)
                .then(res => {
                    console.log('res:', res)
                    gMap.panTo(position)
                    addMarker(position)
                })
            return gMap
        })
    })
}

function addMarker(loc) {
    // gMarker.setMap(null)
    // marker.setMap(null)
    let marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    // gMarker = marker
    return marker
}

function panTo(lat, lng) {
    const laLatLng = new google.maps.LatLng(lat, lng)
    const pos = { lat, lng }
    gMap.panTo(laLatLng)

    addMarker(pos)
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    // const API_KEY = 'AIzaSyCqKcNqorCJzdRv2YIRmnLVZdCHnBkWrsw'
    const API_KEY = 'AIzaSyAkgkyh-JVQ7-IY8N3yy0Kqzy1G4M62NT8'
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    // elGoogleApi.src = ` http://maps.google.com/maps/api/js?libraries=places&sensor=false?key=${API_KEY}`

    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function debounce(func, wait) {
    let timeout
    return (...args) => {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

function moveTo(lat, lng) {
    const pos = { lat, lng }
    panTo(lat, lng)
    new google.maps.Marker({
        position: pos,
        map: gMap
    })
}
