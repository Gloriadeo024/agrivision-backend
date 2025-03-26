const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Role Schema
const RoleSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  permissions: [{ type: String, required: true }], // Example: ['READ_INVENTORY', 'MANAGE_USERS']
}, { timestamps: true });

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Hash password before saving user
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Models
const Role = mongoose.model('Role', RoleSchema);
const User = mongoose.model('User', UserSchema);

// Generate JWT Token
const tokenGenerator = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Middleware to check user permissions
const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).populate('role');
      if (!user) return res.status(401).json({ message: 'User not found' });
      
      if (!user.role.permissions.includes(requiredPermission)) {
        return res.status(403).json({ message: 'Access Denied' });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
};

module.exports = { Role, User, checkPermission, tokenGenerator };
