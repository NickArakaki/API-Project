import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import ProfileButton from "./ProfileButton";

import './Navigation.css'

export default function Navigation({ isLoaded }) {
    const sessionUser = useSelector((state) => state.session.user)

    return (
        <ul className="nav_links_list">
            <li>
                <NavLink className="home_link" exact to="/">
                    <i className="fa-solid fa-couch fa-xl" />
                </NavLink>
            </li>
            <li className="header_title">
                Couch Crashers
            </li>
            {isLoaded && (
                <li>
                    <ProfileButton className="profile_button" user={sessionUser} />
                </li>
            )}
        </ul>
    )
}
