import { useSelector } from "react-redux";

import OpenModalButton from "../../OpenModalButton";
import DeleteReviewModal from "../../DeleteReviewModal/DeleteReviewModal";

import { formatDate } from "../../../utils/formatting";

export default function SpotReview({ review }) {
    const sessionUser = useSelector(state => state.session.user);

    const displayButton = sessionUser.id === review.userId;

    const date = new Date(review.updatedAt);
    const year = date.getFullYear();
    const month = (date.getMonth()) + 1;
    const day = date.getDate();
    const formattedDate = formatDate(year, month, day);

    return (
        <div className="spot_review">
            <div className="user_review_user_firstName">{review.User.firstName}</div>
            <div className="user_review_date">{formattedDate}</div>
            <p className="user_review_review">{review.review}</p>
            {displayButton && (
                <div className="user_review_delete_modal_container">
                    <OpenModalButton
                        modalComponent={<DeleteReviewModal review={review} />}
                        buttonText="Delete"
                    />
                </div>
            )}
        </div>
    )
}
