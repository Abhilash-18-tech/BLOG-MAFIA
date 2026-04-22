const User = require('../models/User');

exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      username: req.body.username,
      email: req.body.email
    };

    // If an image was uploaded, save its filename
    if (req.file) {
      fieldsToUpdate.profilePicture = `http://localhost:5000/uploads/${req.file.filename}`;
    } else if (req.body.profilePicture) {
      // If an avatar string/URL was provided directly
      fieldsToUpdate.profilePicture = req.body.profilePicture;
    }

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });
  } catch (err) {
    next(err);
  }
};