export default function ReviewsSummary({ spot }) {
    // conditionally assign what should be displayed to a variable
    let numReviews;

    if (!spot.numReviews) {
        numReviews = "";
    } else if (spot.numReviews === 1) {
        numReviews = " • 1 Review"
    } else if (spot.numReviews > 1) {
        numReviews = ` • ${spot.numReviews} Reviews`
    }

    return (
            <div className="callout_box_star_reviews">
                <i className="fa-sharp fa-solid fa-star fa-sm" />{spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "New"}{numReviews}
            </div>
    )
}
