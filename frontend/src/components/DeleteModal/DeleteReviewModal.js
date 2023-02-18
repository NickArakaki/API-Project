import { useModal } from "../../context/Modal"
import { useDispatch } from "react-redux";

import * as reviewActions from "../../store/reviews";

import "./DeleteModal.css"

export default function DeleteReviewModal({ review }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDeleteConfirmation = () => {
        dispatch(reviewActions.deleteUserReviewThunk(review))
            .then(closeModal)
    };

    return (
        <div className="delete_confirmation_modal">
            <h1 className="delete_confirmation_title">Confirm Delete</h1>
            <p className="delete_confirmation_info">Are you sure you want to delete this review?</p>
            <button onClick={handleDeleteConfirmation} className="delete_confirmation_button">{"Yes (Delete Review)"}</button>
            <button onClick={closeModal} className="delete_cancel_button">{"No (Keep Review)"}</button>
        </div>
    )

}
