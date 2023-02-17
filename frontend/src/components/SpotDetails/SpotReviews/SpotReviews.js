import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as reviewActions from "../../../store/reviews";

import SpotReview from "./SpotReview";

import "./SpotReviews.css";

export default function SpotReviews({ spotId }) {
    const spotReviews = useSelector(state => state.reviews.orderedSpotReviews);
    const dispatch = useDispatch();

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(reviewActions.getSpotReviewsThunk(spotId))
            .then(() => setIsLoaded(true))
    }, [dispatch])

    return (
        <div className="spot_reviews_div">
            {isLoaded && (
                <>
                    {spotReviews.map(spotReview => {
                        return (
                            <SpotReview key={spotReview.id} review={spotReview} />
                        )
                    })}
                </>
            )}
        </div>
    )
}
