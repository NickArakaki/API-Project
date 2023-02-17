import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Link, Redirect } from "react-router-dom";

import OpenModalButton from "../OpenModalButton";
import SpotTile from "../SpotTile/SpotTile";
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
        <div className="user_spot_tile_wrapper">
            {Object.values(userSpots).map(userSpot => (
                <div key={userSpot.id} className="user_spot_tile">
                        <Link className="user_spot_tile_link" to={`/spots/${userSpot.id}`} >
                            <SpotTile spot={userSpot} />
                        </Link>
                        <div className="user_spot_tile_reviews_management_div">
                            <div className="user_spot_tile_management_div">
                                <div className="manage_user_spot_button_container">
                                    <Link to={`/myspots/${userSpot.id}/edit`}>
                                        <button className="user_spot_tile_update_button">Update</button>
                                    </Link>
                                </div>
                                <div className="manage_user_spot_button_container">
                                    <OpenModalButton
                                        modalComponent={<DeleteSpotModal spot={userSpot} />}
                                        buttonText="Delete"
                                        />
                                </div>
                            </div>
                        </div>
                </div>
            ))}
        </div>
    )
}
