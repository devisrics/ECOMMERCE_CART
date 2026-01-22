import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../actions/userActions";
import { clearAuthError, clearPasswordReset } from "../../slices/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const { loading, error, isPasswordReset } = useSelector(
    (state) => state.authState
  );

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { position: "bottom-center" });
      return;
    }

    dispatch(resetPassword(token, { password, confirmPassword }));
  };

  useEffect(() => {
    if (isPasswordReset) {
      toast.success("Password reset successful", { position: "bottom-center" });
      dispatch(clearPasswordReset());
      navigate("/login");
    }

    if (error) {
      toast.error(error, { position: "bottom-center" });
      dispatch(clearAuthError());
    }
  }, [dispatch, error, isPasswordReset, navigate]);

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form className="shadow-lg" onSubmit={submitHandler}>
          <h1 className="mb-3">Reset Password</h1>

          <div className="form-group">
            <label htmlFor="password_field">New Password</label>
            <input
              id="password_field"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password_field">Confirm Password</label>
            <input
              id="confirm_password_field"
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-block py-3"
            disabled={loading}
          >
            {loading ? "Updating..." : "Set Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
