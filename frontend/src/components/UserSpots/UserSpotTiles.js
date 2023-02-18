import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Link, Redirect } from "react-router-dom";

import OpenModalButton from "../OpenModalButton";
import UserSpotTile from "./UserSpotTile";
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
                    <UserSpotTile spot={userSpot} />
                </div>
            ))}
        </div>
    )
}
