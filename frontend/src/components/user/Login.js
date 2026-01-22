import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/userActions";
import { clearAuthError } from "../../slices/authSlice";
import MetaData from "../layouts/MetaData";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearCart } from "../../slices/cartSlice";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const location = useLocation();

    const { loading, error, isAuthenticated } = useSelector((state) => state.authState);

    // Get redirect path from query string (e.g., ?redirect=shipping)
    const redirect = location.search ? "/" + location.search.split("=")[1] : "/";

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    // Clear cart and localStorage on login page load
    useEffect(() => {
        dispatch(clearCart());
        localStorage.removeItem("cartItems");
        localStorage.removeItem("shippingInfo");
    }, [dispatch]);

    // Handle login success or error
    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirect);
        }

        if (error) {
            toast.error(error, { position: "bottom-center" });
            dispatch(clearAuthError());
        }
    }, [error, isAuthenticated, dispatch, navigate, redirect]);

    return (
        <Fragment>
            <MetaData title="Login" />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler} className="shadow-lg">
                        <h1 className="mb-3">Login</h1>

                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Link to="/password/forgot" className="float-right mb-4">
                            Forgot Password?
                        </Link>

                        <button
                            id="login_button"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading}
                        >
                            LOGIN
                        </button>

                        <Link to="/register" className="float-right mt-3">
                            New User?
                        </Link>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}
