import { csrfFetch } from './csrf';

/******************************** CONSTS TO PREVENT TYPOS *************************/
const GET_SPOT_REVIEWS = 'reviews/GET_SPOT_REVIEWS';
const GET_USER_REVIEWS = 'reviews/GET_USER_REVIEWS';
const DELETE_USER_REVIEW = 'reviews/DELETE_USER_REVIEW';

/*********************************OBJECT ACTION CREATORS **************************/
const getSpotReviews = spotReviews => {
    return {
        type: GET_SPOT_REVIEWS,
        spotReviews
    }
}

const getUserReviews = userReviews => {
    return {
        type: GET_USER_REVIEWS,
        userReviews
    }
}

const deleteUserReview = (reviewId) => {
    return {
        type: DELETE_USER_REVIEW,
        reviewId
    }
}

/********************************** THUNK ACTION CREATORS *************************/
// CREATE
export const addSpotReviewThunk = (spotId, review) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review)
    });
    const postedReview = await response.json();
    dispatch(getSpotReviewsThunk(spotId))
    return postedReview;
}

// READ
export const getSpotReviewsThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const data = await response.json();
    dispatch(getSpotReviews(data.Reviews));
    return data;
}

export const getUserReviewsThunk = () => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/current`);
    const data = await response.json();
    dispatch(getUserReviews(data.Reviews));
    return data;
}

// DELETE
export const deleteUserReviewThunk = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE"
    });
    const confirmation = await response.json();
    dispatch(deleteUserReview(reviewId));
    return confirmation;
}

/************************************** REDUCER ***********************************/
const initialState = { spotReviews: {}, userReviews: {}, orderedSpotReviews: [] }

export default function reviewsReducer(state=initialState, action) {
    Object.freeze(state);

    switch(action.type) {
        case GET_SPOT_REVIEWS: {
            // normalize spot reviews
            const normalizedSpotReviews = {};
            action.spotReviews.forEach(review => normalizedSpotReviews[review.id] = review)

            // sort the reviews by updatedAt
            const orderedReviews = action.spotReviews;
            orderedReviews.sort((a, b) => {
                return Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
            })

            return { ...state, spotReviews: normalizedSpotReviews, orderedSpotReviews: orderedReviews }
        }
        case GET_USER_REVIEWS: {
            const normalizedUserReviews = {};
            action.userReviews.forEach(review => normalizedUserReviews[review.spotId] = review)
            return { ...state, userReviews: normalizedUserReviews };
        }
        case DELETE_USER_REVIEW: {
            const newState = {...state};
            return newState;
        }
        default:
            return state
    }
}
