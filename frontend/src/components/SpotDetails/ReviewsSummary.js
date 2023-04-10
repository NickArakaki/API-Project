export default function ReviewsSummary({ spot }) {
    // conditionally assign what should be displayed to a variable
    // just calculate the average star rating on the frontend
    let numReviews;

    if (!spot.numReviews) {
        numReviews = "";
    } else if (spot.numReviews === 1) {
        numReviews = " • 1 Review"
    } else {
        numReviews = ` • ${spot.numReviews} Reviews`
    }

    return (
            <div className="review_summary">
                <i className="fa-sharp fa-solid fa-star fa-sm" />
                <div className="review_summary_rating_and_number">
                {spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "New"}{numReviews}
                </div>
            </div>
    )
}
