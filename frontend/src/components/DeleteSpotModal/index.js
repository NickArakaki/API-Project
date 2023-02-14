import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal"
import * as spotActions from "../../store/spots";

import "./DeleteSpotModal.css"

export default function DeleteSpotModal({ spot }) {
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [unauthorized, setUnauthorized] = useState(false)

    const confirmDelete = () => {
        if (sessionUser.id !== spot.ownerId) { // Validate user has authorization to delete spot
            setUnauthorized(true)
        } else {
            console.log("Dispatch commencing")
            dispatch(spotActions.deleteUserSpotThunk(spot.id))
                .then(closeModal)
        }
    }

    if (unauthorized) return <h2>You are not authorized delete this spot</h2>

    return (
        <div className="delete_spot_modal_div">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot?</p>
            <div className="delete_spot_modal_buttons_div">
                <button onClick={confirmDelete} className="delete_spot_modal_button_delete">{"Yes (Delete Spot)"}</button>
                <button onClick={closeModal} className="delete_spot_modal_button_cancel">{"No (Keep Spot)"}</button>
            </div>
        </div>
    )
}
