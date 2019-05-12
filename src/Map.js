/* global google:false */
import React, {Component} from 'react'
import axios from 'axios'

import Feed from './Feed'
export default class Map extends Component {
    constructor(){
        super()
        this.state = {
            api: [],
            markers: [],
            lastOpen: '',
        }
    }


    getGoogleMaps() {
        // If we haven't already defined the promise, define it
        if (!this.googleMapsPromise) {
            this.googleMapsPromise = new Promise((resolve) => {
                // Add a global handler for when the API finishes loading
                window.resolveGoogleMapsPromise = () => {
                    resolve(google)
                    // Tidy up
                    delete window.resolveGoogleMapsPromise
                }

                // Load the Google Maps API
                const script = document.createElement("script")
                const API = 'AIzaSyDbAz1XXxDoKSU2nZXec89rcHPxgkvVoiw'
                script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`
                script.async = true
                document.body.appendChild(script)
            })
        }
        // Return a promise for the Google Maps API
        return this.googleMapsPromise
    }

    handler_click_marker = (map, infoWindow, marker) => {
        map.setZoom(5)
        map.panTo(marker.position);
        infoWindow.open(map, marker)

        // always close last opened tooltip
        this.state.lastOpen && this.state.lastOpen.close()
        this.setState({lastOpen: infoWindow})
    }

    componentWillMount() {
        // Start google API's loading since we know we'll soon need it
        this.getGoogleMaps()
    }

    componentDidMount() {
        // dirty temporary solution for common problem with cors origin
        const workaoundForCorsSettingsOnServer = 'https://cors-anywhere.herokuapp.com/'

        // get data from API with coordinates and place names
        axios(`${workaoundForCorsSettingsOnServer}https://s3-eu-west-1.amazonaws.com/omnifi/techtests/locations.json`)
            .then(res => {
                return res
            })
            .then(res => {
                this.setState({ api: res.data }) 
                // Once the all API's has finished loading, initialize the map
                this.getGoogleMaps().then((google) => {
                    const london = {lat: 52.00, lng: 0.00}
                    const map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 3,
                        center: london
                    })

                    // loop true json data and set every marker separately
                    // save it for later use
                    const markers = this.state.api && this.state.api.map(el => {
                        const marker = new google.maps.Marker({
                            position: {lat: el.latitude, lng: el.longitude},
                            map: map,
                            title: el.name
                        })
                        const infoWindow = new google.maps.InfoWindow({
                            content: el.name
                        })
                        marker.addListener('click', this.handler_click_marker.bind(this, map, infoWindow, marker))
                        return marker
                    })
                    this.setState({markers})
                })
            })
            .catch(function(error) {
                console.error('Request failed', error)
            })
    }



    render() {
        const style = {
            container: { display: "flex", },
            map: {
                height: "500px",
                width: "500px",
            },
        }

        const {markers} = this.state
        return (
            <div id="Container" style={style.container}>
                <div id="map" style={style.map}></div>
                <Feed markers={markers} />
            </div>
        )
    }
}

