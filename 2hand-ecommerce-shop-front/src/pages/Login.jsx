import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendLogin } from "../api/send-login";
import { AuthContext, LoginContext } from "../contexts/auth-context.jsx";
import logoblack from "../assets/img/TrocoBlack.svg";
import "../assets/css/pagescss/Login.css";

//State to set the payload fo the form
export function Login() {
    const [payload, setPayload] = useState({
        username: "",
        email: "",
        password: "",
    });

    //Use Context to take the current user and the login. Navigate to send user to other page afetr Login.
    const { currentUser } = useContext(AuthContext);
    const login = useContext(LoginContext);
    const navigate = useNavigate();

    //Function to
    async function onSubmit(evt) {
        evt.preventDefault();
        try {
            const { token } = await sendLogin(payload);
            login(token);
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (currentUser) {
            navigate("/");
        }
    }, [currentUser, navigate]);

    return (
        <main className="loginPage">
            <form onSubmit={onSubmit} className="loginForm">
                <Link className="aLogin" to="/">
                    <button
                        className="loginButton1"
                        style={{ backgroundImage: `url(${logoblack})` }}
                    ></button>
                </Link>
                <h1 className="loginH1">Log into your account</h1>
                <div className="inputLogin">
                    <input
                        className="inputLogin2"
                        type="text"
                        id="username"
                        name="username"
                        placeholder="User Name"
                        required
                        onChange={(evt) =>
                            setPayload({
                                ...payload,
                                username: evt.target.value,
                            })
                        }
                    />
                </div>
                <div className="inputLogin">
                    <input
                        className="inputLogin2"
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email Address"
                        required
                        onChange={(evt) =>
                            setPayload({ ...payload, email: evt.target.value })
                        }
                    />
                </div>
                <div className="inputLogin">
                    <input
                        className="inputLogin2"
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        required
                        onChange={(evt) =>
                            setPayload({
                                ...payload,
                                password: evt.target.value,
                            })
                        }
                    />
                </div>
                <button className="loginButton">Login</button>
                <p className="pLogin">
                    Don&apos;t have an account?{" "}
                    <Link to="/Register" className="registerLogin">
                        Register
                    </Link>
                </p>
            </form>
        </main>
    );
}
