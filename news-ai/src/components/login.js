import { useState } from "react";
import { auth } from "../firebase-config";
import "../styles/login.css"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function Login({ setUserEmail, setOpenLogin }) {
    const [openRegisterPage, setOpenRegisterPage] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newConfirmPassword, setNewConfirmPassword] = useState("");
    const [errorRegistering, setErrorRegister] = useState("");
    const [errorLogin, setErrorLogin] = useState("");

    async function handleRegister(e) {
        e.preventDefault();
        setErrorRegister("");

        if (newPassword !== newConfirmPassword || newPassword.length < 6) {
            return;
        }

        try {
            const response = await createUserWithEmailAndPassword(auth, newEmail, newPassword);
            window.sessionStorage.setItem("email", response._tokenResponse.email);
            setUserEmail(response._tokenResponse.email);
            setNewConfirmPassword("");
            setNewEmail("");
            setNewPassword("");
        } catch (e) {
            console.error(e);
            setErrorRegister("Error registering user");
        }
    }

    async function handleLogin(e) {
        e.preventDefault();
        setErrorLogin("");

        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            window.sessionStorage.setItem("email", response._tokenResponse.email);
            setUserEmail(response._tokenResponse.email);
            setEmail("");
            setPassword("");
        } catch (e) {
            console.error(e);
            setErrorLogin("Invalid login credential");
        }
    }

    return (
        <div className="card login-card">
            <button className='btn-close' onClick={() => { setOpenLogin(false) }}></button>
            {openRegisterPage ?
                <div>

                    <form onSubmit={handleRegister} >

                        <div className="error-box">
                            {errorRegistering || newEmail !== "" ? <div style={{ color: '#FF6347' }}>{errorRegistering}</div> : ""}
                            {newPassword.length < 6 && newPassword !== "" ? <div style={{ color: '#FF6347' }}>Password too short</div> : ""}
                            {newConfirmPassword !== "" && newPassword !== "" ?
                                (newPassword === newConfirmPassword ? <div style={{ color: 'lime' }}>Passwords match</div> : <div style={{ color: '#FF6347' }}>Passwords do not match</div>)
                                : ""}
                        </div>

                        <h1>Register New</h1>
                        <input placeholder="Email" onChange={(e) => setNewEmail(e.target.value)} value={newEmail} type="email" required />

                        <input placeholder="Password" type="password" onChange={(e) => setNewPassword(e.target.value)} value={newPassword} />
                        <input placeholder="Confirm Password" type="password" onChange={(e) => setNewConfirmPassword(e.target.value)} value={newConfirmPassword} />

                        <button type="submit" className="btn btn-dark">Register</button>
                    </form>
                    <button className="btn" onClick={() => setOpenRegisterPage(!openRegisterPage)}>Already Registered?</button>
                </div>
                :
                <div>

                    <form onSubmit={handleLogin}  >

                        <div className="error-box">
                            {errorLogin ? <p style={{ color: '#FF6347' }}>{errorLogin}</p> : null}
                        </div>
                        <h1>Login</h1>
                        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                        <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                        <button type="submit" className="btn btn-dark">Login</button>
                    </form>
                    <button className="btn" onClick={() => setOpenRegisterPage(!openRegisterPage)}>New user?</button>
                </div>
            }
        </div>
    );
}
