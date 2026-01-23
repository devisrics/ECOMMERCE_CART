import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearAuthError } from '../../actions/userActions';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, isAuthenticated } = useSelector(state => state.authState);

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.png');

    // Input change handler
    const onChange = e => {
        const { name, value, files } = e.target;

        if (name === 'avatar' && files && files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                }
            };
            reader.readAsDataURL(files[0]);
            setAvatar(files[0]);
        } else {
            setUserData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Form submit handler
    const submitHandler = e => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        if (avatar) formData.append('avatar', avatar);

        dispatch(register(formData));
    };

    // Handle errors & redirection
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }

        if (error) {
            toast.error(error, {
                position: 'bottom-center',
                onOpen: () => dispatch(clearAuthError())
            });
        }
    }, [error, isAuthenticated, dispatch, navigate]);

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form
                    onSubmit={submitHandler}
                    className="shadow-lg"
                    encType="multipart/form-data"
                >
                    <h1 className="mb-3">Register</h1>

                    <div className="form-group">
                        <label htmlFor="name_field">Name</label>
                        <input
                            type="text"
                            id="name_field"
                            name="name"
                            className="form-control"
                            value={userData.name}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email_field">Email</label>
                        <input
                            type="email"
                            id="email_field"
                            name="email"
                            className="form-control"
                            value={userData.email}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password_field">Password</label>
                        <input
                            type="password"
                            id="password_field"
                            name="password"
                            className="form-control"
                            value={userData.password}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="avatar_upload">Avatar</label>
                        <div className="d-flex align-items-center">
                            <figure className="avatar mr-3 item-rtl">
                                <img
                                    src={avatarPreview}
                                    alt="Avatar Preview"
                                    className="rounded-circle"
                                    width={50}
                                    height={50}
                                />
                            </figure>
                            <div className="custom-file">
                                <input
                                    type="file"
                                    name="avatar"
                                    className="custom-file-input"
                                    id="customFile"
                                    accept="image/*"
                                    onChange={onChange}
                                />
                                <label className="custom-file-label" htmlFor="customFile">
                                    Choose Avatar
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-block py-3"
                        id="register_button"
                        disabled={loading}
                    >
                        {loading ? 'REGISTERING...' : 'REGISTER'}
                    </button>
                </form>
            </div>
        </div>
    );
}
