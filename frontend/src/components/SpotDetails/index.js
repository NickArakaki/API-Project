import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import * as spotActions from '../../store/spots';

import "./SpotDetails.css";

export default function SpotDetails() {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.singleSpot);

    useEffect(() => {
        dispatch(spotActions.getSingleSpotThunk(spotId));
    }, [dispatch])

    if (!Object.values(spot).length) return <h2>Unable to retrieve details. Please try again shortly.</h2>;

    return (
        <>
            <h2>{spot.name}</h2>
            <div>{spot.city}, {spot.state}, {spot.country}</div>
            {spot.SpotImages.map(spotImage => (
                <img key={spotImage.id} src={spotImage.url} />
            ))}
            <div>
                Hosted by: {spot.Owner.firstName} {spot.Owner.lastName}
            </div>
            <p>
                {spot.description}
            </p>
            <div className="spot_details_callout_info_box">
                <div className="spot_details_callout_info_box_price">${spot.price} night</div>
                <button className="spot_details_callout_info_box_register_button">Register</button>
            </div>
        </>
    )
}
