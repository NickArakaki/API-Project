import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom";
import * as spotActions from "../../store/spots";
import SpotTile from "./SpotTile";

import "./SpotTile.css"

export default function SpotTiles() {
    const dispatch = useDispatch();
    const allSpots = useSelector((state) => state.spots.allSpots)
    const [haveFetchedSpots, setHaveFetchedSpots] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        dispatch(spotActions.getAllSpotsThunk())
            .then(() => {
                setHaveFetchedSpots(true)
                setIsLoaded(true)
            })
            .catch(() => {
                setHaveFetchedSpots(false)
                setIsLoaded(true)
            })
    }, [dispatch])

    if (!haveFetchedSpots && isLoaded) return <h2>Unable to retrieve spots. Please try again shortly</h2>;

    return (
        <>
            <h2>All Spots</h2>
            <div className="spot_tile_wrapper">
                {Object.values(allSpots).map(spot => (
                    <Link key={spot.id} to={`/spots/${spot.id}`} >
                        <SpotTile spot={spot} />
                    </Link>
                    ))}
            </div>
        </>
    )
}
