import { csrfFetch } from "./csrf";

// CONSTS TO PREVENT TYPOS
const GET_ALL_SPOTS = 'spots/GET_ALL_SPOTS';
const GET_SINGLE_SPOT = '/spots/GET_SINGLE_SPOT';
const ADD_SPOT = '/spots/ADD_SPOT';

// OBJECT ACTION CREATORS
const getAllSpots = (allSpots) => {
    return {
        type: GET_ALL_SPOTS,
        allSpots
    }
}

const getSingleSpot = (spot) => {
    return {
        type: GET_SINGLE_SPOT,
        spot
    }
}

// THUNK ACTION CREATORS
export const getAllSpotsThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    const allSpots = await response.json();
    dispatch(getAllSpots(allSpots.Spots));
    return allSpots;
}

export const getSingleSpotThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    const singleSpot = await response.json();
    dispatch(getSingleSpot(singleSpot));
    return singleSpot;
}

export const addSpotThunk = (spotData, spotImages) => async (dispatch) => {
    const spotResponse = await csrfFetch(`/api/spots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spotData)
    });
    // wait for successful response before sending spotImage POST request
    const spotData = await spotResponse.json();

    // use the id assigned to spot to add spotImages
    // iterate over spotImages input array
    spotImages.forEach(spotImage => {
        const spotImageResponse = await csrfFetch(`api/spots/${}/images`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(spotImage)
        })
    })

    // after success of both dispatch state change for single spot
    dispatch(getSingleSpot(/*spot id returned from response*/))
}

const initialState = { allSpots: {}, singleSpot: {} }

// REDUCER
export default function spotsReducer(state=initialState, action) {
    Object.freeze(state);

    switch (action.type) {
        case GET_ALL_SPOTS: {
            const normalizedSpots = {};
            action.allSpots.forEach(spot => normalizedSpots[spot.id] = spot);
            return { ...state, allSpots: normalizedSpots };
        }
        case GET_SINGLE_SPOT: {
            return { ...state, singleSpot: action.spot };
        }
        default:
            return state;
    }
}
