import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"

import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal";
import * as spotActions from '../../store/spots';

export default function UserSpotTiles({ user }) {
    const dispatch = useDispatch();
    const userSpots = useSelector(state => state.spots.userSpots);

    useEffect(() => {
        dispatch(spotActions.getUserSpotsThunk(user.id))
    }, [dispatch])

    if (!Object.values(userSpots)) return <h1>There are no spots</h1>

    return (
        <>
            {Object.values(userSpots).map(userSpot => (
                <div key={userSpot.id} className="user_spot_tile">
                    <img src={userSpot.previewImage} alt={`${userSpot.name} preview image`} />
                    <div className="user_spot_tile_details_div">
                        <div className="user_spot_tile_details_location_price_div">
                            <div className="user_spot_tile_location_div">
                                {userSpot.city}, {userSpot.state}
                            </div>
                            <div className="user_spot_tile_price_div">
                                ${userSpot.price} night
                            </div>
                        </div>
                        <div className="user_spot_tile_reviews_management_div">
                            <div className="user_spot_tile_reviews_div">
                                <i className="fa-solid fa-star" /> {userSpot.avgRating || "new"}
                            </div>
                            <div className="user_spot_tile_management_div">
                                <button className="user_spot_tile_update_button button">Update</button>
                                <OpenModalButton
                                    modalComponent={<DeleteSpotModal spot={userSpot} />}
                                    buttonText="Delete"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}
