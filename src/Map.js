/* global google:false */
import React, {Component} from 'react'
import axios from 'axios'

export default class Map extends Component {
    constructor(props){
        super(props)
        this.state = {
            api: [],
            markers: []
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
        // Start both API's loading since we know we'll soon need it
        this.getGoogleMaps()
    }

    componentDidMount() {
        const workaoundForCorsSettingsOnServer = 'https://cors-anywhere.herokuapp.com/'
        axios(`${workaoundForCorsSettingsOnServer}https://s3-eu-west-1.amazonaws.com/omnifi/techtests/locations.json`)
            .then(res => {
                return res
            })
            .then(res => {
                this.setState({ api: res.data }) 
                // Once the all API's has finished loading, initialize the map
                this.getGoogleMaps().then((google) => {
                    // debugger
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
                        marker.addListener('click', () => infoWindow.open(map, marker))
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
            container: {
                display: "flex",
            },
            map: {
                height: "500px",
                width: "500px",
                border: "2px solid black",
            },
            feed: {
            }
        }

        const {markers, api} = this.state
        console.log(markers[0] && markers[0].title)
        return (
            <div id="Container" style={style.container}>
                <div id="map" style={style.map}></div>
                <Feed markers={markers} />
            </div>
        )
    }
}

function Feed (props) {
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
        <ul>
            {markers && markers.map((marker, idx) => <li style={css.li} onClick={handler_click.bind(null, idx)}>{marker.title}</li>)}
        </ul>
    )
}
