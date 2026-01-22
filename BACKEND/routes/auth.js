const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads/user'));
  },
  filename: function (req, file, cb) {
    const uniqueName = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueName}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }
});

const {
  registerUser,
  loginUser,
  logoutUser,
  forgotpassword,
  resetPassword,
  getUserProfile,
  changePassword,
  updateProfile,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/authController');

const {
  isAuthenticatedUser,
  authorizeRoles
} = require('../middlewares/authenticate');

const router = express.Router();

router.post('/register', upload.single('avatar'), registerUser);
router.post('/login', loginUser);
router.post('/logout', isAuthenticatedUser, logoutUser);
router.post('/password/forgot', forgotpassword);
router.put('/password/reset/:token', resetPassword);
router.get('/myprofile', isAuthenticatedUser, getUserProfile);
router.put('/password/change', isAuthenticatedUser, changePassword);
router.put('/update', isAuthenticatedUser, upload.single('avatar'), updateProfile);

router.get('/admin/users', isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.get('/admin/user/:id', isAuthenticatedUser, authorizeRoles('admin'), getUser);
router.put('/admin/user/:id', isAuthenticatedUser, authorizeRoles('admin'), updateUser);
router.delete('/admin/user/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

module.exports = router;
