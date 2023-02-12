import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import ProfileButton from "./ProfileButton";
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import './Navigation.css'

export default function Navigation({ isLoaded }) {
    const sessionUser = useSelector((state) => state.session.user)

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <li>
                <ProfileButton className="session_links" user={sessionUser} />
            </li>
        )
    } else {
        sessionLinks = (
            <li>
                <OpenModalButton
                    className="session_links"
                    buttonText="Log In"
                    modalComponent={<LoginFormModal />}
                />
                <OpenModalButton
                    className="session_links"
                    buttonText="Sign Up"
                    modalComponent={<SignupFormModal />}
                />
            </li>
        )
    }

    return (
        <ul className="nav_links_list">
            <li>
                <NavLink className="home_link" exact to="/">Home</NavLink>
            </li>
            {isLoaded && sessionLinks}
        </ul>
    )
}
