import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

import * as reviewActions from "../../store/reviews";
import UserReview from './UserReview';

import "./UserReviews.css";

export default function UserReviews() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const sessionUser = useSelector(state => state.session.user);
    const userReviews = useSelector(state => state.reviews.userReviews);

    useEffect(() => {
        dispatch(reviewActions.getUserReviewsThunk())
            .then(() => setIsLoaded(true))
    }, [dispatch])

    if (!sessionUser) return <Redirect to="/" />


    return (
        <div className="manage_reviews_div">
            <h1 className="manage_reviews_title">My Reviews</h1>
            {isLoaded && Object.values(userReviews).length > 0 && (
                <div>
                    {Object.values(userReviews).map(userReview => {
                        return (
                            <UserReview key={userReview.id} review={userReview} />
                        )
                    })}
                </div>
            )}
            {isLoaded && Object.values(userReviews).length <= 0 && (
                <div className="empty_user_reviews_list">Please visit a spot to post a review</div>
            )}
        </div>
    )
}
