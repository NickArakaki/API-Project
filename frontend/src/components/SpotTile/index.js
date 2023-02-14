import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import * as spotActions from "../../store/spots";
import SpotTile from "./SpotTile";

export default function SpotTiles() {
    const dispatch = useDispatch();
    const allSpots = useSelector((state) => state.spots.allSpots);

    useEffect(() => {
        dispatch(spotActions.getAllSpotsThunk())
    }, [dispatch])

    if (!allSpots) return <h2>Unable to retrieve spots. Please try again shortly</h2>;

    return (
        <>
            <h2>All Spots</h2>
            {Object.values(allSpots).map(spot => (
                <SpotTile key={spot.id} spot={spot} />
            ))}
        </>
    )
}
