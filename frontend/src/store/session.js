import { csrfFetch } from "./csrf";

// CONSTS TO PREVENT TYPOS
const ADD_SESSION_USER = 'session/ADD_SESSION_USER';
const REMOVE_SESSION_USER = 'session/REMOVE_SESSION_USER';

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
export const login = (userCredentials) => async (dispatch) => {
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

export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch('/api/session');
    const data = await response.json();
    dispatch(addUser(data.user));
    return response;
}

export const signup = (newUser) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = newUser;
    const response = await csrfFetch('/api/users', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username,
            firstName,
            lastName,
            email,
            password
        })
    });
    const user = await response.json();
    dispatch(addUser(user));
    return response;
}

// is it necessary to make a req to logout user? or can we just remove them from the state?
// export const logout = () => async (dispatch) => {
//     const response = await csrfFetch('/api/session', {
//         method: 'DELETE'
//     });

//     dispatch(removeUser())
//     return response;
// }

const initialState = { user: null }

// REDUCER
export default function sessionReducer(state=initialState, action) {
    Object.freeze(state); // prevent accidental manipulation of state obj

    switch (action.type) {
        case ADD_SESSION_USER: {
            return { ...state ,user: action.user }
        }
        case REMOVE_SESSION_USER: {
            return { ...initialState }
        }
        default:
            return state
    }
}
