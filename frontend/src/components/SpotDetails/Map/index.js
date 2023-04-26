import { useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api"

import "./Map.css"


function Map() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
    })

    const center = useMemo(() => ({ lat: 40, lng: -80}), [])

    if (!isLoaded) return <div>Loading...</div>

    return (
        <GoogleMap zoom={10} center={center} mapContainerClassName="map">
            <Marker position={center}></Marker>
        </GoogleMap>
    )
}

export default Map;
