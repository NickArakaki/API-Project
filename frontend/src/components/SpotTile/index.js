import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom";
import * as spotActions from "../../store/spots";
import SpotTile from "./SpotTile";

import "./SpotTile.css"

export default function SpotTiles() {
    const dispatch = useDispatch();
    const allSpots = useSelector((state) => state.spots.allSpots)
    const [successfulFetch, setSuccessfulFetch] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        dispatch(spotActions.getAllSpotsThunk())
            .then(() => {
                setSuccessfulFetch(true)
                setIsLoaded(true)
            })
            .catch(() => {
                setSuccessfulFetch(false)
                setIsLoaded(true)
            })
    }, [dispatch])

    if (!successfulFetch && isLoaded) return <h2>Unable to retrieve spots. Please try again shortly</h2>;

    return (
        <div className="spot_tile_wrapper">
            {isLoaded && (
                <>
                    {Object.values(allSpots).map(spot => (
                        <Link key={spot.id} to={`/spots/${spot.id}`} >
                            <SpotTile spot={spot} />
                        </Link>
                    ))}
                </>
            )}
        </div>
    )
}
