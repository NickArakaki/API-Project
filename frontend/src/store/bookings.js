import { csrfFetch } from "./csrf";

/****************************** CONSTS ***********************************/
const GET_SPOT_BOOKINGS = 'bookings/GET_SPOT_BOOKINGS'
const GET_USER_BOOKINGS = 'bookings/GET_USER_BOOKINGS'
const POST_SPOT_BOOKING = 'bookings/POST_SPOT_BOOKING'
const UPDATE_SPOT_BOOKING = 'bookings/UPDATE_SPOT_BOOKING'
const DELETE_SPOT_BOOKING = 'bookings/DELETE_SPOT_BOOKING'


/***************************** ACTION CREATORS ******************************/
const getAllSpotBookings = bookings => {
    return {
        type: GET_SPOT_BOOKINGS,
        payload: bookings
    }
}

const getUserBookings = bookings => {
    return {
        type: GET_USER_BOOKINGS,
        payload: bookings
    }
}

const postSpotBooking = booking => {
    return {
        type: POST_SPOT_BOOKING,
        payload: booking
    }
}

const updateSpotBooking = booking => {
    return {
        type: UPDATE_SPOT_BOOKING,
        payload: booking
    }
}

const deleteSpotBooking = (bookingId) => {
    return {
        type: DELETE_SPOT_BOOKING,
        payload: bookingId
    }
}


/***************************** THUNKS ***************************************/
export const getAllSpotBookingsThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`)
    const data = await response.json();
    dispatch(getAllSpotBookings(data.Bookings));
    return data;
}

export const getAllUserBookingsThunk = (spotId, booking) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/:spotId/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(booking)
    })

    const postedBooking = await response.json();
    dispatch(postSpotBooking(postedBooking));
    return postedBooking;
}

export const postSpotBookingThunk = (spotId) => async (dispatch) => {
    // /api/bookings/:spotId, POST
}

// export const updateSpotBookingThunk => (bookingId) => async (dispatch) => {
//     // /api/bookings/:bookingId, PUT
// }

// export const deleteSpotBookingThunk => (bookingId) => async(dispatch) => {
//     // /api/bookings/:bookingId, DELETE
// }


/******************************** REDUCER ***************************/
const initialState = { spotBookings: {}, userBookings: {} }

export default function bookingsReducer(state=initialState, action) {
    Object.freeze(state);
    const newState = { ...state }

    switch(action.type) {
        case GET_SPOT_BOOKINGS: {
            newState.spotBookings = {}
            for (const booking of action.payload) {
                newState.spotBookings[booking.startDate] = booking
            }
            return newState;
        }
        case POST_SPOT_BOOKING: {
            newState.spotBookings = { ...state.spotBookings };
            newState.userBookings = { ...state.userBookings };
            newState.spotBookings[action.payload.startDate] = action.payload;
            newState.userBookings[action.payload.id] = action.payload;
            return newState;
        }
        default:
            return state;
    }
}
