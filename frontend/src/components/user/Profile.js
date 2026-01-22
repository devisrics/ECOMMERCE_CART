import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
    const { user } = useSelector((state) => state.authState);

    return (
        <div className="row justify-content-around mt-5 user-info">
            {/* Avatar and Edit Profile */}
            <div className="col-12 col-md-3 text-center">
                <figure className="avatar avatar-profile">
                    <img
                        className="rounded-circle img-fluid"
                        src={user.avatar ?? "./images/default_avatar.png"}
                        alt={user.name || "User Avatar"}
                    />
                </figure>

                <Link
                    to="/myprofile/update"
                    id="edit_profile"
                    className="btn btn-primary btn-block my-5"
                >
                    Edit Profile
                </Link>
            </div>

            {/* User Information */}
            <div className="col-12 col-md-5">
                <h4>Full Name</h4>
                <p>{user.name}</p>

                <h4>Email Address</h4>
                <p>{user.email}</p>

                <h4>Joined On</h4>
                <p>{user.createdAt ? String(user.createdAt).substring(0, 10) : "N/A"}</p>

                <Link to="/orders" className="btn btn-danger btn-block mt-5">
                    My Orders
                </Link>

                <Link
                    to="/myprofile/update/password"
                    className="btn btn-primary btn-block mt-3"
                >
                    Change Password
                </Link>
            </div>
        </div>
    );
}
