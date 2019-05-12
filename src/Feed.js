/* global google:false */
import React from 'react'

export default function Feed (props) {
    const {markers} = props
    const css ={
        li: {
            cursor: "pointer",
        },
    }

    const handler_click = (id) => {
        google.maps.event.trigger(markers[id], 'click')
    }

    return (
        <ul className="map_feed">
            {markers && markers.map((marker, idx) =>
            <li className="map_feed_item"
                style={css.li}
                onClick={handler_click.bind(null, idx)}>{marker.title}</li>
            )}
        </ul>
    )
}
