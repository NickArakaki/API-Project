import { useModal } from "../../context/Modal"
import { useDispatch } from "react-redux";

import * as reviewActions from "../../store/reviews";

export default function DeleteReviewModal({ reviewId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDeleteConfirmation = () => {
        dispatch(reviewActions.deleteUserReviewThunk(reviewId))
            .then(closeModal)
    };

    return (
        <div className="delete_review_confirmation_modal">
            <h1 className="delete_review_confirmation_title">Confirm Delete</h1>
            <p className="delete_review_confirmation_info">Are you sure you want to delete this review</p>
            <button onClick={handleDeleteConfirmation} className="delete_review_confirmation_button">{"Yes (Delete Review)"}</button>
            <button onClick={closeModal} className="delete_review_cancel_button">{"No (Keep Review)"}</button>
        </div>
    )

}
