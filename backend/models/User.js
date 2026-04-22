const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: function() { return !this.googleId; },
    minlength: 6,
    select: false // Do not return password by default
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  savedPosts: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Post'
    }
  ],
  likedPosts: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Post'
    }
  ],
  followers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  following: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  profilePicture: {
    type: String,
    default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
  },
  resetPasswordOtp: {
    type: String,
    select: false
  },
  resetPasswordOtpExpiry: {
    type: Date,
    select: false
  }
}, { timestamps: true });

// Encrypt password using bcrypt
UserSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
