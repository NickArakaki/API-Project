import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import AddSpotForm from "../AddSpotForm";
import * as spotActions from "../../store/spots";

export default function UpdateUserSpotForm() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const { spotId } = useParams();

    useEffect(() => {
        // set single spot to current spot when here
        dispatch(spotActions.getSingleSpotThunk(spotId))
            .then(() => setIsLoaded(true));
    }, [dispatch])

    if (!isLoaded) return <h2>Loading</h2>

    return (
        <AddSpotForm spotId={spotId} />
    )
}
