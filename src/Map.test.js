import React from 'react'
import ReactDOM from 'react-dom'
import Map from './Map.js'

it('renders without crashing', () => {
    const div = document.createElement('div')
    div.setAttribute('id', 'g_map')

    ReactDOM.render(<Map />, div)
    ReactDOM.unmountComponentAtNode(div)
})
