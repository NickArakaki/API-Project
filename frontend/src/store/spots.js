import { csrfFetch } from "./csrf";

// CONSTS TO PREVENT TYPOS
const GET_ALL_SPOTS = 'spots/GET_ALL_SPOTS';
const GET_SINGLE_SPOT = '/spots/GET_SINGLE_SPOT';

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