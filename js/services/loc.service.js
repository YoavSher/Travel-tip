import { utilService } from './util.service.js'
import { storageService } from './storage.service.js'
// import { mapService } from './map.service.js'

export const locService = {
    getLocs,
    createNewLoc,
    addNewLoc,
    deleteLoc,
    getLocCords,
    showWeather
}
const STORAGE_KEY = 'locsDB'

let locs = [
    // {
    //     id: utilService.makeId(4),
    //     name: 'Greatplace',
    //     lat: 32.047104,
    //     lng: 34.832384
    // },
    // {
    //     id: utilService.makeId(4),
    //     name: 'Neveragain',
    //     lat: 32.047201,
    //     lng: 34.832581
    // }
]

function getLocs() {
    if (!locs || locs.length === 0) {
        return new Promise((resolve) => {
            locs = storageService.loadFromStorage(STORAGE_KEY)
            resolve(locs)
        })
    }
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}

function createNewLoc(lat, lng, name) {
    return {
        id: utilService.makeId(4),
        name,
        lat,
        lng,
        createdAt: Date.now()
    }
}

function addNewLoc(newLoc) {
    // console.log('newLoc:', newLoc)
    const GEO_KEY = 'AIzaSyAkgkyh-JVQ7-IY8N3yy0Kqzy1G4M62NT8'
    return axios
        .get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${newLoc.lat},${newLoc.lng}&key=${GEO_KEY}`
        )
        .then((res) => res.data)
        .then((res) => {
            // console.log('res:', res)
            return res.results[0]
        })
        .then(res => {
            const place = {
                id: res.place_id,
                name: res.formatted_address,
                lat: res.geometry.location.lat,
                lng: res.geometry.location.lng,
                createdAt: Date.now()
            }
            locs.push(place)
            storageService.saveToStorage(STORAGE_KEY, locs)
            return {
                lat: place.lat,
                lng: place.lng
            }
        })
    // locs.push(newLoc)
    // storageService.saveToStorage(STORAGE_KEY, locs)
    // console.log('locs:', locs)
}

function deleteLoc(locId) {
    const locIdx = locs.findIndex((loc) => locId === loc.id)
    locs.splice(locIdx, 1)
    storageService.saveToStorage(STORAGE_KEY, locs)
}

function getLocById(locId) {
    const loc = locs.find((loc) => loc.id === locId)

    if (loc) return loc
    return null
}

function getLocCords(loc) {
    // const GEO_KEY = 'AIzaSyADmJszuAEFAjCArXNXeV1QISKs6Rgn8Bk'
    const GEO_KEY = 'AIzaSyAkgkyh-JVQ7-IY8N3yy0Kqzy1G4M62NT8'

    return axios
        .get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${loc}&key=${GEO_KEY}`
        )
        .then((res) => res.data)
        .then((res) => {
            console.log('res:', res)
            if (!res.results.length) return Promise.reject('No matching places')
            // return {
            //     lat: res.results[0].geometry.location.lat,
            //     lng: res.results[0].geometry.location.lng
            // }
            return res.results[0]
        })
        .then(res => {
            const place = {
                id: res.place_id,
                name: res.formatted_address,
                lat: res.geometry.location.lat,
                lng: res.geometry.location.lng,
                createdAt: Date.now()
            }
            locs.push(place)
            storageService.saveToStorage(STORAGE_KEY, locs)
            return {
                lat: place.lat,
                lng: place.lng
            }
            // console.log('place:', place)
        })
        .catch(()=>{
            throw new Error('Something went wrong')
        })
}

function showWeather(lat, lng){
    const WEATHER_KEY = '7487cc1b8e2469f2bb505e7e02073617'
    return axios
        .get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_KEY}`
        )
        .then((res) => res.data)
        .then((res) => {
            // console.log('res:', res)
            return{
                place: res.name,
                country: res.sys.country,
                weather: res.weather[0].description,
                temp: res.main.temp,
                humid: res.main.humidity,
                // icon: `\${res.weather.icon}`
            }
        })
        .catch(() => {
            throw new Error('Could not find weather')
        })
}
