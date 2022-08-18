import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

// window.app = {
//     onSearchLocation
// }

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
// window.onSearchPlace = onSearchPlace
window.onDeleteLoc = onDeleteLoc
window.onSearchLocation = onSearchLocation
window.onCopyTxt = onCopyTxt

function onInit() {
    const elInput = document.querySelector('[name=search-loc]')
    // elInput.addEventListener('input', mapService.debounce(onGetLocs, 1000))
    // console.log('elInput:', elInput)
    mapService
        .initMap()
        .then(() => {
            console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then((locs) => {
            console.log('Locations:', locs)
            // document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
            let strHtml = ''
            locs.map((loc) => {
                strHtml += `
                <tr>
                <td>${loc.name}</td>
                <td>${loc.lat}</td>
                <td>${loc.lng}</td>
                <td>${new Date(loc.createdAt).toLocaleString()}</td>
                <td ><button onclick="onDeleteLoc(${loc.id})">Delete</button></td>
                <td ><button onclick="onPanTo(${loc.lat},${loc.lng})">Go To</button></td>
                </tr>`
            }).join('')
            document.querySelector('table .location-display').innerHTML = strHtml
        })
    document.querySelector('.btn-get-locs').classList.add('hide')
    document.querySelector('.loc-table').classList.remove('hide')
}

function onGetUserPos() {
    getPosition()
        .then((pos) => {
            console.log('User position is:', pos.coords)
            document.querySelector(
                '.user-pos'
            ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            mapService.panTo(pos.coords.latitude, pos.coords.longitude)
            const marker = mapService.addMarker({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            })
            showWeather(pos.coords.latitude, pos.coords.longitude)
                .then(res => res)

            // gMarker = marker
        })
        .catch((err) => {
            console.log('err!!!', err)
        })

    // .then(res=>{
    //     console.log('res:', res)
    // })
    //     .catch((err) => {
    //         console.log('err!!!', err)
    //     })
}

function onPanTo(lat, lng) {
    console.log('Panning the Map')
    // mapService.panTo(35.6895, 139.6917)
    mapService.panTo(lat, lng)
    showWeather(lat, lng)
    document.querySelector('.btn-get-locs').classList.remove('hide')
    document.querySelector('.loc-table').classList.add('hide')
}

function onDeleteLoc(locId) {
    locService.deleteLoc(locId)
    // console.log('locId:', locId)
}

function onSearchLocation(ev) {
    ev.preventDefault()
    console.log('ev:', ev)
    const elSearch = document.querySelector('[name=loc-search]')
    const location = elSearch.value
    // console.log('location:', location)
    locService.getLocCords(location)
        .then((cords) => {
            onPanTo(cords.lat, cords.lng)

            showWeather(cords.lat, cords.lng)
                .then(res => res)

                .catch((err) => {
                    console.log('err!!!', err)
                })
        })
}

function showWeather(lat, lng) {
    locService.showWeather(lat, lng)
        .then(res => {
            // console.log('res:', res)
            const strHtml = `
        <table>
        <tr><td>Place</td><td>${res.place}, ${res.country}</td></tr>
        <tr><td>Temp</td><td>${(res.temp / 10).toFixed(2)} degrees</td></tr>
        <tr><td>Humidity</td><td>${res.humid}%</td></tr>
        <tr><td>Weather</td><td>${res.weather}</td></tr>
        `
            document.querySelector('.weather-box').innerHTML = strHtml
        })
}

function onCopyTxt() {
    /* Get the text field */
    const copyText = 'https://SagivBn.github.io/travel-tip/'

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText);

    /* Alert the copied text */
    alert("Copied the text: " + copyText);
}
