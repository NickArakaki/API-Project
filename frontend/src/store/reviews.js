import { csrfFetch } from './csrf';
import { getSingleSpotThunk } from './spots';

/******************************** CONSTS TO PREVENT TYPOS *************************/
const ADD_SPOT_REVIEW = 'reviews/ADD_SPOT_REVIEW'
const GET_SPOT_REVIEWS = 'reviews/GET_SPOT_REVIEWS';
const GET_USER_REVIEWS = 'reviews/GET_USER_REVIEWS';
const DELETE_USER_REVIEW = 'reviews/DELETE_USER_REVIEW';

/*********************************OBJECT ACTION CREATORS **************************/
const addSpotReview = (spotReview, userInfo) => {
    return {
        type: ADD_SPOT_REVIEW,
        review: spotReview,
        user: userInfo
    }
}

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
export const addSpotReviewThunk = (spotId, review, user) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review)
    });
    const postedReview = await response.json();
    const userInfo = user;
    dispatch(getSingleSpotThunk(spotId));
    dispatch(addSpotReview(postedReview, userInfo));
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
        case ADD_SPOT_REVIEW: {
            // const previewImage = action.spot.SpotImages.find(spotImage => spotImage.preview === true);

            const newSpotReview = {
                ...action.review,
                User: {
                    id: action.user.id,
                    firstName: action.user.firstName,
                    lastName: action.user.lastName
                },
                ReviewImages: []
            };

            // const newUserReview = {
            //     ...action.review,
            //     spotId: action.spot.id,
            //     User: {
            //         id: action.user.id,
            //         firstName: action.user.firstName,
            //         lastName: action.user.lastName
            //     },
            //     Spot: {
            //         id: action.spot.id,
            //         ownerId: action.spot.ownerId,
            //         city: action.spot.city,
            //         state: action.spot.state,
            //         country: action.spot.country,
            //         lat: action.spot.lat,
            //         lng: action.spot.lng,
            //         name: action.spot.name,
            //         price: action.spot.price,
            //         previewImage: previewImage.url
            //     }
            // }

            const newState = { ...state,
                                    spotReviews: { ...state.spotReviews },
                                    userReviews: { ...state.userReviews},
                                    orderedSpotReviews: [ ...state.orderedSpotReviews, newSpotReview ]
            }

            newState.spotReviews[action.review.id] = newSpotReview;
            // newState.userReviews[action.review.id] = newUserReview;
            return newState
        }
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
            action.userReviews.forEach(review => normalizedUserReviews[review.id] = review)
            return { ...state, userReviews: normalizedUserReviews };
        }
        case DELETE_USER_REVIEW: {
            const newState = {...state};
            delete newState[action.re]
            return newState;
        }
        default:
            return state
    }
}
