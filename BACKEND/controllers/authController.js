const catchAsyncError = require('../middlewares/catchAsyncError');
const User = require('../models/userModel');
const sendEmail = require('../utils/email');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwt');
const crypto = require('crypto');
const path = require('path');

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  let avatar;
  let BASE_URL = process.env.BACKEND_URL;

  if (process.env.NODE_ENV === 'production') {
    BASE_URL = `${req.protocol}://${req.get('host')}`;
  }

  if (req.file) {
    avatar = `${BASE_URL}/uploads/user/${req.file.filename}`;
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar
  });

  sendToken(user, 201, res);
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Please enter email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isValidpassword(password))) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  sendToken(user, 200, res);
});

exports.logoutUser = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });

  res.status(200).json({
    success: true,
    message: 'Logged out'
  });
};

exports.forgotpassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler('User not found with this email', 404));
  }

  const resetToken = user.getResetToken();
  await user.save({ validateBeforeSave: false });

  let BASE_URL = process.env.FRONTEND_URL;

  if (process.env.NODE_ENV === 'production') {
    BASE_URL = `${req.protocol}://${req.get('host')}`;
  }

  const resetUrl = `${BASE_URL}/password/reset/${resetToken}`;

  const message = `Your password reset link:\n\n${resetUrl}\n\nIf you did not request this, ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Recovery',
      message
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorHandler('Reset token is invalid or expired', 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Passwords do not match', 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

exports.getUserProfile = catchAsyncError(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user
  });
});

exports.changePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.isValidpassword(req.body.oldPassword))) {
    return next(new ErrorHandler('Old password is incorrect', 401));
  }

  user.password = req.body.password;
  await user.save();

  res.status(200).json({
    success: true
  });
});

exports.updateProfile = catchAsyncError(async (req, res) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email
  };

  let BASE_URL = process.env.BACKEND_URL;

  if (process.env.NODE_ENV === 'production') {
    BASE_URL = `${req.protocol}://${req.get('host')}`;
  }

  if (req.file) {
    newUserData.avatar = `${BASE_URL}/uploads/user/${req.file.filename}`;
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    user
  });
});

exports.getAllUsers = catchAsyncError(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users
  });
});

exports.getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  res.status(200).json({
    success: true,
    user
  });
});

exports.updateUser = catchAsyncError(async (req, res) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    user
  });
});

exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true
  });
});
