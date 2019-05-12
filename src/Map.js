import React, {Component} from 'react'

export default class Map extends Component {
    constructor(props){
        super(props)
        this.state = {
        }
    }

    API_KEY = 'AIzaSyCwO_zeKZ9hDaXiP-ZM_rrSC21X_0KoPe8'
    api_url = (API_KEY) => `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`

    render() {
        const style = {
            height: "100%",
            width: "100%",
        }

        return (
            <div id="map" style={style}>
                <script src={this.api_url(this.API_KEY)} async defer></script>
            </div>
        )
    }
}

