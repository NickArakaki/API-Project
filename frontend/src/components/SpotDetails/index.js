import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import * as spotActions from '../../store/spots';
import * as reviewActions from '../../store/reviews';
import * as bookingActions from '../../store/bookings';

import SpotReviews from "./SpotReviews/SpotReviews";
import OpenModalButton from "../OpenModalButton";
import ReviewModal from "../AddReviewModal";
import CalloutBox from "./CalloutBox";
import ReviewsSummary from "./ReviewsSummary";

import "./SpotDetails.css";

export default function SpotDetails() {
    const dispatch = useDispatch();
    const { spotId } = useParams();

    const spot = useSelector((state) => state.spots.singleSpot);
    const sessionUser = useSelector(state => state.session.user);
    const reviews = useSelector((state) => state.reviews.orderedSpotReviews);

    const [isLoaded, setIsLoaded] = useState(false);
    const [successfulFetch, setSuccessfulFetch] = useState(false);
    const [userHasReview, setUserHasReview] = useState(null);

    useEffect(() => {
        dispatch(spotActions.getSingleSpotThunk(spotId))
            .then(() => dispatch(reviewActions.getSpotReviewsThunk(spotId)))
            .then(() => dispatch(bookingActions.getAllSpotBookingsThunk(spotId)))
            .then(() => {
                setSuccessfulFetch(true)
                setIsLoaded(true)
            })
            .catch(() => {
                setSuccessfulFetch(false)
                setIsLoaded(true)
            });
    }, [dispatch, spotId])

    // iterate over reviews to see if any of the reviews have a userId === session userId
    useEffect(() => {
        const userReview = reviews.find(review => review.userId === sessionUser?.id)
        if (userReview) {
            setUserHasReview(true)
        } else {
            setUserHasReview(false)
        }
    }, [reviews, sessionUser])

    if (isLoaded && !successfulFetch) return <h2>Unable to retrieve details. Please try again shortly.</h2>;

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
                        <img className="spot_details_images_previewImage" src={previewImage.url} alt={`${spot.name} preview`} />
                        <div className="spot_details_images_spotImages_div">
                            {spotImages.map(spotImage => (
                                    <img key={spotImage.id} className="spot_details_images_spotImage" src={spotImage.url} alt={spot.name}/>
                                    ))}
                        </div>
                    </div>
                    <div className="spot_details_spot_info_div">
                        <div className="spot_details_spot_info_host_description_div">
                            <div className="spot_details_host_details">
                                Hosted by: {spot.Owner.firstName} {spot.Owner.lastName}
                            </div>
                            <p className="spot_details_description">
                                {spot.description}
                            </p>
                        </div>
                        <div className="spot_details_callout_info_box">
                            <CalloutBox spot={spot} />
                        </div>
                    </div>
                </div>
                <div className="spot_details_reviews_div">
                    <ReviewsSummary spot={spot} />
                    {sessionUser && sessionUser.id !== spot.Owner.id && !userHasReview && (
                        <div className="spot_details_post_review_button_div">
                            <OpenModalButton
                                modalComponent={<ReviewModal spotId={spotId} />}
                                buttonText="Post Your Review"
                            />
                        </div>
                    )}
                    {reviews.length < 1 && sessionUser && sessionUser.id !== spot.Owner.id && (
                        <div className="spot_details_no_reviews_text">Be the first to post a review!</div>
                    )}
                    <SpotReviews spotId={spotId} />
                </div>
            </>
        )}
        </div>
    )
}
