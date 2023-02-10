import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { signup } from "../../store/session";


export default function SignupFormPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([]);

    if (sessionUser) return <Redirect to="/" />

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password === confirmPassword) {
            setErrors([]);

            return dispatch(signup({
                username,
                firstName,
                lastName,
                email,
                password
            })).catch(async (res) => {
                const data = await res.json();
                console.log(data);
            })
        }

        return setErrors(['Confirm Password field must be the same as the Password field'])
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Sign Up</label>
            <ul>
                {errors.map((error, index) => <li key={index} className="error">{error}</li>)}
            </ul>
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
                Email
                <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
            <button type="submit">Sign Up</button>
        </form>
    )
}
