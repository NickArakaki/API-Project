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
    // /api/bookings/:spotId, GET
    // do the things
}

export const getAllUserBookingsThunk = (spotId) => async (dispatch) => {
    // /api/bookings/current, GET
    // do the things
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
const initialState = {}

export default function bookingsReducer(state=initialState, action) {
    Object.freeze(state);

    switch(action.type) {
        default:
            return state;
    }
}
