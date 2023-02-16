import { Link, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import * as spotActions from '../../store/spots';
import * as reviewActions from '../../store/reviews';

import CalloutBox from "./CalloutBox";

import "./SpotDetails.css";
import ReviewsSummary from "./ReviewsSummary";
import Review from "./Review";

export default function SpotDetails() {
    const dispatch = useDispatch();
    const { spotId } = useParams();

    const spot = useSelector((state) => state.spots.singleSpot);
    const reviews = useSelector((state) => state.reviews.orderedSpotReviews);
    const sessionUser = useSelector(state => state.session.user);
    const userReviews = useSelector(state => state.reviews.userReviews);

    const [isLoaded, setIsLoaded] = useState(false);
    const [successfulFetch, setSuccessfulFetch] = useState(false);
    const [userHasReview, setUserHasReview] = useState(null);

    useEffect(() => {
        dispatch(spotActions.getSingleSpotThunk(spotId))
            .then(() => dispatch(reviewActions.getSpotReviewsThunk(spotId)))
            .then(() => dispatch(reviewActions.getUserReviewsThunk(spotId)))
            .then(() => {
                // check if user has review for this spot using userId and postId
                setUserHasReview(!!userReviews[spotId]);
                setSuccessfulFetch(true)
                setIsLoaded(true)
            })
            .catch(() => {
                setSuccessfulFetch(false)
                setIsLoaded(true)
            });
    }, [dispatch, spotId])

    if (!successfulFetch && isLoaded) return <h2>Unable to retrieve details. Please try again shortly.</h2>;

    // iterate over SpotImages: assign previewImage the image where preview === true, if not === true add to other spot images
    let previewImage;
    const spotImages = [];
    if (isLoaded) {
        spot.SpotImages.forEach(spotImage => {
            if (spotImage.preview === true) {
                previewImage = spotImage
            } else {
                spotImages.push(spotImage)
            }
        })
    }

    return (
        <div className="spot_details_div">
        {isLoaded && (
            <>
                <div className="spot_details_info_div">
                    <h2 className="spot_details_name">{spot.name}</h2>
                    <div className="spot_details_location">{spot.city}, {spot.state}, {spot.country}</div>
                    <div className="spot_details_images_div">
                        <img className="spot_details_images_previewImage" src={previewImage.url} alt={`${spot.name} preview image`} />
                        <div className="spot_details_images_spotImages_div">
                            {spotImages.map(spotImage => (
                                    <img key={spotImage.id} className="spot_details_images_spotImage" src={spotImage.url} />
                                    ))}
                        </div>
                    </div>
                    <div className="spot_details_spot_info_div">
                        <div className="spot_details_spot_info_host_description_div">
                            <div className="spot_details_host_details">
                                Hosted by: {spot.Owner.firstName} {spot.Owner.lastName}
                            </div>
                            <p>
                                {spot.description}
                            </p>
                        </div>
                        <div className="spot_details_callout_info_box">
                            <CalloutBox spot={spot} />
                        </div>
                    </div>
                </div>
                <div className="spot_details_reviews_div">
                    <div className="spot_details_review_summary_div">
                        <ReviewsSummary spot={spot} />
                    </div>
                    {sessionUser && sessionUser.id !== spot.Owner.id && !userHasReview && (
                        <button onClick={() => alert("Open modal for adding a review coming soon")} className="spot_details_post_review_button button">Open Modal Button to Post Review</button>
                    )}
                    {reviews.map(review => {
                        return (
                            <Review key={review.id} review={review} />
                        )
                    })}
                </div>
            </>
        )}
        </div>
    )
}
