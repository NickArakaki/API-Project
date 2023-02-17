import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Link, Redirect } from "react-router-dom";

import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal";
import * as spotActions from '../../store/spots';

export default function UserSpotTiles({ user }) {
    const dispatch = useDispatch();
    const userSpots = useSelector(state => state.spots.userSpots);

    useEffect(() => {
        // why does this throw an error? I thought that on mount the JS would run before the useEffect
        if (user) {
            dispatch(spotActions.getUserSpotsThunk(user.id))
        }
    }, [dispatch, user])

    if (!user) return <Redirect to="/" />
    if (!Object.values(userSpots)) return <h1>You have no spots</h1>

    return (
        <>
            {Object.values(userSpots).map(userSpot => (
                <div key={userSpot.id} className="user_spot_tile">
                    <img src={userSpot.previewImage} alt={`${userSpot.name} preview`} />
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
                                <Link to={`/myspots/${userSpot.id}/edit`}>
                                    <button className="user_spot_tile_update_button button">Update</button>
                                </Link>
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
