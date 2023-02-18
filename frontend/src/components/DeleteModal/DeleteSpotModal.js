import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal"
import * as spotActions from "../../store/spots";

import "./DeleteModal.css"

export default function DeleteSpotModal({ spot }) {
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [unauthorized, setUnauthorized] = useState(false)

    const confirmDelete = () => {
        if (sessionUser.id !== spot.ownerId) { // Validate user has authorization to delete spot
            setUnauthorized(true)
        } else {
            dispatch(spotActions.deleteUserSpotThunk(spot.id))
                .then(closeModal)
        }
    }

    if (unauthorized) return <h2>You are not authorized delete this spot</h2>

    return (
        <div className="delete_confirmation_modal">
            <h2 className="delete_confirmation_title">Confirm Delete</h2>
            <p className="delete_confirmation_info">Are you sure you want to remove this spot?</p>
            <button onClick={confirmDelete} className="delete_confirmation_button">{"Yes (Delete Spot)"}</button>
            <button onClick={closeModal} className="delete_cancel_button">{"No (Keep Spot)"}</button>
        </div>
    )
}
