import OpenModalButton from "../OpenModalButton";
import DeleteReviewModal from "./DeleteReviewModal";

export default function UserReview({ review }) {
    const date = new Date(review.updatedAt);
    const year = date.getFullYear();
    const month = (date.getMonth()) + 1;
    const day = date.getDate();

    return (
        <div className="user_review_div">
            <h2 className="user_review_spot_name">{review.Spot.name}</h2>
            <h3 className="user_review_date">{year}-{month}-{day}</h3>
            <p className="user_review_review">{review.review}</p>
            <div className="user_review_management_buttons_div">
                <button onClick={() => alert("update review feature coming soon")}>Update</button>
                <OpenModalButton
                    modalComponent={<DeleteReviewModal reviewId={review.id} />}
                    buttonText="Delete"
                />

            </div>
        </div>
    )
}
