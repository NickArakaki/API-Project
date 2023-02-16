export default function Review({ review }) {
    const date = new Date(review.updatedAt);
    const year = date.getFullYear();
    const month = (date.getMonth()) + 1;
    const day = date.getDate();

    return (
        <div key={review.id} className="spot_details_review">
            <div className="spot_details_reviewer_first_name">{review.User.firstName}</div>
            <div className="spot_details_review_date">{year}-{month < 10 ? "0" + month : month}-{day < 10 ? "0" + day.toString(): day}</div>
            <div className="spot_details_review_content">{review.review}</div>
        </div>
    )
}
