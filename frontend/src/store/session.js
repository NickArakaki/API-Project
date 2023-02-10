import { csrfFetch } from "./csrf";

// CONSTS TO PREVENT TYPOS
const ADD_SESSION_USER = 'user/ADD_SESSION_USER';
const REMOVE_SESSION_USER = 'user/REMOVE_SESSION_USER';

// OBJECT ACTION CREATORS
const addUser = (user) => {
    return {
        type: ADD_SESSION_USER,
        user
    }
}

const removeUser = () => {
    return {
        type: REMOVE_SESSION_USER
    }
}

// THUNK ACTION CREATORS
export const addSessionUserThunk = (userCredentials) => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userCredentials)
        /*
            expecting an obj = {
                credential: "valid username or email",
                password: "valid password"
            }
        */
    });

    // do we still need this conditional if we're using csrfFetch?
    if (response.ok) {
        const user = await response.json();
        dispatch(addUser(user));
        return user;
    }
}

const initialState = { user: null }

// REDUCER
export default function sessionReducer(state=initialState, action) {
    switch (action.type) {
        case ADD_SESSION_USER: {
            return { user: action.user }
        }
        case REMOVE_SESSION_USER: {
            console.log('REMOVE_SESSION_USER reducer fired')
            return state
        }
        default:
            return state
    }
}
