import { useState, useEffect, useRef } from 'react';
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { Link } from 'react-router-dom';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      {user && (
        <Link to="/spots/add">
          <button className="add_spot_button">Create a New Spot</button>
        </Link>
        )}
      <button className='profile_menu_button' onClick={openMenu}>
        <i className="fa-solid fa-bars profile_icon" />
        <i className="fa-solid fa-user profile_icon" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <div className='profile_menu_greeting_div'>
              <li>Hello, {user.firstName}</li>
              <li>{user.email}</li>
            </div>
            <div className='profile_menu_management_div'>
              <Link to="/myspots">
                <button onClick={closeMenu} className='manage_button'>Manage Spots</button>
              </Link>
              <Link to="/myreviews">
                <button onClick={closeMenu} className="manage_button">Manage Reviews</button>
              </Link>
            </div>
            <div className='logout_button_wrapper' >
                <button className="logout_button manage_button" onClick={logout}>Log Out</button>
            </div>
          </>
        ) : (
          <>
            <li className='modal_button_wrapper'>
              <OpenModalButton
                buttonText="Log In"
                onButtonClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </li>
            <li className='modal_button_wrapper'>
              <OpenModalButton
                buttonText="Sign Up"
                onButtonClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </li>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
