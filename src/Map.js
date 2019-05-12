/* global google:false */
import React, {Component} from 'react'
import axios from 'axios'

export default class Map extends Component {
    constructor(props){
        super(props)
        this.state = {
        }
    }


    getGoogleMaps() {
        // If we haven't already defined the promise, define it
        if (!this.googleMapsPromise) {
            this.googleMapsPromise = new Promise((resolve) => {
                // Add a global handler for when the API finishes loading
                window.resolveGoogleMapsPromise = () => {
                    // Resolve the promise
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


    componentWillMount() {
        const workaoundForCorsSettingsOnServer = 'https://cors-anywhere.herokuapp.com/'
        axios(`${workaoundForCorsSettingsOnServer}https://s3-eu-west-1.amazonaws.com/omnifi/techtests/locations.json`)
            .then(res => {
                return res
            })
            .then(res => {
                console.log(res.data)
                this.setState({ markers: res.data })
            })
            .catch(function(error) {
                console.error('Request failed', error)
            })


        // Start Google Maps API loading since we know we'll soon need it
        this.getGoogleMaps()
    }

    componentDidMount() {

        // Once the Google Maps API has finished loading, initialize the map
        this.getGoogleMaps().then((google) => {
            const london = {lat: 52.00, lng: 0.00}
            const map = new google.maps.Map(document.getElementById('map'), {
                zoom: 1,
                center: london
            })

            // eslint-disable-next-line
            const marker = new google.maps.Marker({
                position: london,
                map: map
            })
        })
    }



    render() {
        const style = {
            height: "500px",
            width: "500px",
            border: "2px solid black",
        }

        return (
            <div id="map" style={style}></div>
        )
    }
}

