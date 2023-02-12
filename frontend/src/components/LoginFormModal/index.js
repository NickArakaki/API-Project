import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";

import { login } from '../../store/session'
import './LoginForm.css';

export default function LoginFormModal() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user)
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.message) setErrors([data.message]);
            });
    }

    return (
        <form className="login_modal" onSubmit={handleSubmit}>
            <label className="form_title">Log In</label>
            <ul>
                {errors.map((error, index) => <li className="error" key={index}>{error}</li>)}
            </ul>
            <div>
                <label>Username/Email:</label>
                <input required type="text" value={credential} onChange={(e) => setCredential(e.target.value)} />
            </div>
            <div>
                <label>Password:</label>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit">Log In</button>
        </form>
    )
}
