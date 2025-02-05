import { useNavigate } from "react-router-dom";
import { setAuth } from "../../../utils/authService";

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        const fakeToken = "fake-jwt-token";
        const fakeRole = "admin"; 

        setAuth(fakeToken, fakeRole);
        navigate("/");
    };

    return (
        <div>
            <h2>Login</h2>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
