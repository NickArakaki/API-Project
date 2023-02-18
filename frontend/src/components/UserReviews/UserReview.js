import OpenModalButton from "../OpenModalButton";
import DeleteReviewModal from "../DeleteModal/DeleteReviewModal";
import { formatDate } from "../../utils/formatting";

export default function UserReview({ review }) {
    const date = new Date(review.updatedAt);
    const year = date.getFullYear();
    const month = (date.getMonth()) + 1;
    const day = date.getDate();
    const formattedDate = formatDate(year, month, day);

    return (
        <div className="user_review_div">
            <div className="user_review_spot_name">{review.Spot.name}</div>
            <div className="user_review_date">{formattedDate}</div>
            <p className="user_review_review">{review.review}</p>
            <div className="user_review_management_buttons_div">
                <button className="user_review_update_review_button" onClick={() => alert("update review feature coming soon")}>Update</button>
                <div className="delete_user_review_modal_button_container">
                    <OpenModalButton
                        modalComponent={<DeleteReviewModal review={review} />}
                        buttonText="Delete"
                    />
                </div>
            </div>
        </div>
    )
}
