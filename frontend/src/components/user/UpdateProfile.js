import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateProfile } from "../../actions/userActions";
import { clearUpdateProfile, clearAuthError } from "../../slices/authSlice";

export default function UpdateProfile() {
  const dispatch = useDispatch();
  const { error, user, isUpdated, loading } = useSelector(state => state.authState);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.png");

  // Handle avatar change and preview
  const onChangeAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Name and Email are required", { position: "bottom-center" });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (avatar) formData.append("avatar", avatar);

    dispatch(updateProfile(formData));
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      if (user.avatar) setAvatarPreview(user.avatar);
    }

    if (isUpdated) {
      toast.success("Profile updated successfully", {
        position: "bottom-center",
        onOpen: () => dispatch(clearUpdateProfile()),
      });
    }

    if (error) {
      toast.error(error, {
        position: "bottom-center",
        onOpen: () => dispatch(clearAuthError()),
      });
    }
  }, [user, isUpdated, error, dispatch]);

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form onSubmit={submitHandler} className="shadow-lg" encType="multipart/form-data">
          <h1 className="mt-2 mb-5">Update Profile</h1>

          <div className="form-group">
            <label htmlFor="name_field">Name</label>
            <input
              type="text"
              id="name_field"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            <label htmlFor="avatar_upload">Avatar</label>
            <div className="d-flex align-items-center">
              <figure className="avatar mr-3 item-rtl">
                <img src={avatarPreview} className="rounded-circle" alt="Avatar Preview" />
              </figure>
              <div className="custom-file">
                <input
                  type="file"
                  name="avatar"
                  className="custom-file-input"
                  id="customFile"
                  onChange={onChangeAvatar}
                  accept="image/*"
                />
                <label className="custom-file-label" htmlFor="customFile">
                  Choose Avatar
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn update-btn btn-block mt-4 mb-3" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
}
