import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session"

export default function ProfileButton({ user }) {
    const dispatch = useDispatch();

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout())
    };

    return (
        <>
            <button>
                <i className="fa-regular fa-user"></i>
            </button>
            <ul className="profile-dropdown">
                <li>{user.username}</li>
                <li>{user.firstName} {user.lastName}</li>
                <li>{user.email}</li>
                <li>
                    <button onClick={logout}>Log Out</button>
                </li>
            </ul>
        </>
    )
}
