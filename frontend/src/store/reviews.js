import { csrfFetch } from './csrf';

/******************************** CONSTS TO PREVENT TYPOS *************************/
const GET_SPOT_REVIEWS = '/reviews/GET_SPOT_REVIEWS';

/*********************************OBJECT ACTION CREATORS **************************/
const getSpotReviews = reviews => {
    return {
        type: GET_SPOT_REVIEWS,
        reviews
    }
}

/********************************** THUNK ACTION CREATORS *************************/
export const getSpotReviewsThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const data = await response.json();
    dispatch(getSpotReviews(data.Reviews));
    return data;
}

/************************************** REDUCER ***********************************/
const initialState = { spotReviews: {}, userReviews: {}, orderedSpotReviews: [] }

export default function reviewsReducer(state=initialState, action) {
    switch(action.type) {
        case GET_SPOT_REVIEWS: {
            // normalize spot reviews
            const normalizedSpotReviews = {};
            action.reviews.forEach(review => normalizedSpotReviews[review.id] = review)

            // sort the reviews by updatedAt
            const orderedReviews = action.reviews;
            orderedReviews.sort((a, b) => {
                return Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
            })

            return { ...state, spotReviews: normalizedSpotReviews, orderedSpotReviews: orderedReviews }
        }
        default:
            return state
    }
}
