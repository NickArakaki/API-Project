import { csrfFetch } from './csrf';

/******************************** CONSTS TO PREVENT TYPOS *************************/
const GET_SPOT_REVIEWS = '/reviews/GET_SPOT_REVIEWS';
const GET_USER_REVIEWS = '/reviews/GET_USER_REVIEWS';

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

/********************************** THUNK ACTION CREATORS *************************/
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
        default:
            return state
    }
}
