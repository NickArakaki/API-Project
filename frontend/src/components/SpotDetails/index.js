import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import * as spotActions from '../../store/spots';
import * as reviewActions from '../../store/reviews';

import CalloutBox from "./CalloutBox";

import "./SpotDetails.css";

export default function SpotDetails() {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.singleSpot);
    const reviews = useSelector(state => state.reviews.spotReviews);
    const [isLoaded, setIsLoaded] = useState(false);
    const [successfulFetch, setSuccessfulFetch] = useState(false);

    useEffect(() => {
        dispatch(spotActions.getSingleSpotThunk(spotId))
            .then(() => dispatch(reviewActions.getSpotReviewsThunk(spotId)))
            .then(() => {
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
        <>
        {isLoaded && (
            <>
                <div className="spot_details_div">
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
                    <h2>REVIEWS GO HERE</h2>
                </div>
            </>
        )}
        </>
    )
}
