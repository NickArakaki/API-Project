import { csrfFetch } from "./csrf";

// CONSTS TO PREVENT TYPOS
const GET_ALL_SPOTS = 'spots/GET_ALL_SPOTS';

// OBJECT ACTION CREATORS
const getAllSpots = (allSpots) => {
    return {
        type: GET_ALL_SPOTS,
        allSpots
    }
}

// THUNK ACTION CREATORS
export const getAllSpotsThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    const allSpots = await response.json();
    dispatch(getAllSpots(allSpots.Spots));
    return allSpots;
}

const initialState = { allSpots: {}, singleSpot: {} }

// REDUCER
export default function spotsReducer(state=initialState, action) {
    Object.freeze(state);
    // const newState = { ...state };

    switch (action.type) {
        case GET_ALL_SPOTS: {
            const normalizedSpots = {};
            action.allSpots.forEach(spot => normalizedSpots[spot.id] = spot);
            return { ...state, allSpots: normalizedSpots };
        }
        default:
            return state;
    }
}
