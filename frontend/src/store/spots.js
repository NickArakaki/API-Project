import { csrfFetch } from "./csrf";

/******************************** CONSTS TO PREVENT TYPOS *************************/
const GET_ALL_SPOTS = 'spots/GET_ALL_SPOTS';
const GET_USER_SPOTS = 'spots/GET_USER_SPOTS';
const GET_SINGLE_SPOT = '/spots/GET_SINGLE_SPOT';
const ADD_SPOT_IMAGE = 'spots/ADD_SPOT_IMAGE';
const DELETE_USER_SPOT = 'spots/DELETE_USER_SPOT';

/*********************************OBJECT ACTION CREATORS **************************/
const getAllSpots = (allSpots) => {
    return {
        type: GET_ALL_SPOTS,
        allSpots
    }
}

const getUserSpots = (userSpots) => {
    return {
        type: GET_USER_SPOTS,
        userSpots
    }
}

const getSingleSpot = (spot) => {
    return {
        type: GET_SINGLE_SPOT,
        spot
    }
}

const addSpotImage = (spotImage) => {
    return {
        type: ADD_SPOT_IMAGE,
        spotImage
    }
}

const deleteUserSpot = (spotId) => {
    return {
        type: DELETE_USER_SPOT,
        spotId
    }
}

/********************************** THUNK ACTION CREATORS *************************/
// CREATE
export const addSpotThunk = (spotData) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spotData)
    });
    const spot = await response.json();
    dispatch(getSingleSpotThunk(spot.id));
    return spot;
}

export const addSpotImageThunk = (spotId, spotImage) => async (dispatch, useState) => {
    const currSingleSpot = useState(state => state.spots.singleSpot);

    if (Number(currSingleSpot.id) !== Number(spotId)) {
        dispatch(getSingleSpotThunk(spotId))
    }

    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spotImage)
    });

    const image = await response.json();
    dispatch(addSpotImage(image));
    return image;
}

// READ
export const getAllSpotsThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    const allSpots = await response.json();
    dispatch(getAllSpots(allSpots.Spots));
    return allSpots;
}

export const getUserSpotsThunk = () => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/current`);
    const userSpots = await response.json();
    dispatch(getUserSpots(userSpots.Spots));
    return userSpots;
}

export const getSingleSpotThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    const singleSpot = await response.json();
    dispatch(getSingleSpot(singleSpot));
    return singleSpot;
}

// DELETE
export const deleteUserSpotThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE"
    });
    const confirmation = await response.json();
    dispatch(deleteUserSpot(spotId));
    return confirmation;
}

/************************************** REDUCER ***********************************/

const initialState = { allSpots: {}, singleSpot: {}, userSpots: {} }

export default function spotsReducer(state=initialState, action) {
    Object.freeze(state);

    switch (action.type) {
        case ADD_SPOT_IMAGE: {
            return {...state,
                        singleSpot: {...state.singleSpot,
                            SpotImages: [...state.singleSpot.SpotImages, action.spotImage]
                        }
                    }
        }
        case GET_ALL_SPOTS: {
            const normalizedSpots = {};
            action.allSpots.forEach(spot => normalizedSpots[spot.id] = spot);
            return { ...state, allSpots: normalizedSpots };
        }
        case GET_USER_SPOTS: {
            const normalizedSpots = {};
            action.userSpots.forEach(spot => normalizedSpots[spot.id] = spot);
            return { ...state, userSpots: normalizedSpots }
        }
        case GET_SINGLE_SPOT: {
            return { ...state, singleSpot: action.spot };
        }
        case DELETE_USER_SPOT: {
            // go through state find spot in all spots, find spot in userSpots and remove them
            const newState = { ...state };
            newState.allSpots = { ...state.allSpots };
            newState.userSpots = { ...state.userSpots};
            delete newState.allSpots[action.spotId];
            delete newState.userSpots[action.spotId];
            return newState;
        }
        default:
            return state;
    }
}
