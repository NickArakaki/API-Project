import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { useModal } from "../../context/Modal";
import { signup } from "../../store/session";

import './SignupForm.css';


export default function SignupFormModal() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [disableSubmit, setDisableSubmit] = useState(true);
    const { closeModal } = useModal();

    useEffect(() => {
        if (!firstName || !lastName || !email || !username|| !password || !confirmPassword ) {
            setDisableSubmit(true);
        } else if (username.length < 4) {
            setDisableSubmit(true);
        } else if (password.length < 6) {
            setDisableSubmit(true)
        } else if (password !== confirmPassword) {
            setDisableSubmit(true)
        } else {
            setDisableSubmit(false);
        }
    }, [firstName, lastName, email, username, password, confirmPassword])

    if (sessionUser) return <Redirect to="/" />

    const subButtonClass = disableSubmit ? " disabled" : " enabled";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
          setErrors([]);
          return dispatch(signup({ email, username, firstName, lastName, password }))
            .then(closeModal)
            .catch(async (res) => {
              const data = await res.json();
              if (data && data.errors) setErrors(Object.values(data.errors));
            });
        }
        return setErrors(['Confirm Password field must be the same as the Password field']);
      };

    return (
        <form className="signup_modal" onSubmit={handleSubmit}>
            <label>Sign Up</label>
            {errors.length > 0 && (
                <ul className="signup_errors">
                    {errors.map((error, index) => <li key={index} className="signup_error">{error}</li>)}
                </ul>
            )}
            <div>
                First Name:
                <input
                    required
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </div>
            <div>
                Last Name:
                <input
                    required
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </div>
            <div>
                Email:
                <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                Username:
                <input
                    required
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                 />
            </div>
            <div>
                Password:
                <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div>
                Confirm Password:
                <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            <button disabled={disableSubmit} className={`submit_button ${subButtonClass}`} type="submit">Sign Up</button>
        </form>
    )
}
