import { useEffect, useState } from 'react';
import { updatePassword as updatePasswordAction } from '../../actions/userActions';
import { clearAuthError } from '../../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const { isUpdated, error, loading } = useSelector(state => state.authState);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("New password must be at least 6 characters", { position: "bottom-center" });
      return;
    }

    const formData = new FormData();
    formData.append('oldPassword', oldPassword);
    formData.append('password', password);

    dispatch(updatePasswordAction(formData));
  };

  useEffect(() => {
    if (isUpdated) {
      toast.success("Password updated successfully", { position: "bottom-center" });
      setOldPassword("");
      setPassword("");
    }

    if (error) {
      toast.error(error, {
        position: "bottom-center",
        onOpen: () => dispatch(clearAuthError())
      });
    }
  }, [isUpdated, error, dispatch]);

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form onSubmit={submitHandler} className="shadow-lg">
          <h1 className="mt-2 mb-5">Update Password</h1>

          <div className="form-group">
            <label htmlFor="old_password_field">Old Password</label>
            <input
              type="password"
              id="old_password_field"
              className="form-control"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="new_password_field">New Password</label>
            <input
              type="password"
              id="new_password_field"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn update-btn btn-block mt-4 mb-3"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
