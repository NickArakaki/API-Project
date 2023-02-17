import { useState, useEffect } from "react"
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

import { login } from '../../store/session'
import './LoginForm.css';

export default function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.message) setErrors(["The provided credentials were invalid"]);
            });
    }

    const logInDemo = () => {
        dispatch(login({
            credential: "DemoUser",
            password: "password"
        })).then(closeModal)
    }

    useEffect(() => {
        if (credential.length >= 4 && password.length >= 6) {
            setSubmitDisabled(false);
        } else {
            setSubmitDisabled(true);
        }
    }, [credential, password])

    const subButtonClass = "submit_button" + (submitDisabled ? " disabled" : " enabled");

    return (
        <form className="login_modal" onSubmit={handleSubmit}>
            <label className="form_title">Log In</label>
            {errors.length > 0 && (
                <ul className="login_errors_list">
                    {errors.map((error, index) => <li className="login_error" key={index}>{error}</li>)}
                </ul>
            )}
            <div>
                <label className="login_form_input_heading">Username or Email:</label>
                <input required type="text" value={credential} onChange={(e) => setCredential(e.target.value)} />
            </div>
            <div>
                <label className="login_form_input_heading">Password:</label>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className={subButtonClass} disabled={submitDisabled} type="submit">Log In</button>
            <button className="demo_user_login_button" onClick={logInDemo}>
                Demo User
            </button>
        </form>
    )
}
