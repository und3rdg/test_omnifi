import React from 'react'
import ReactDOM from 'react-dom'
import Map from './Map.js'
import * as serviceWorker from './serviceWorker'

const id_name = 'g_map'
const root = document.getElementById(id_name)

function init() {
    if(!root) {
        console.warn(`Container id="${id_name}" not found`)
        return
    } 


    ReactDOM.render(<Map />, root)
    serviceWorker.unregister()
}

init()
