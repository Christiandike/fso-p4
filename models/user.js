const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    minLength: 3,
    required: true,
  },
  passwordHash: String,
  blogs: [
    // an array because a user can have multiple blogs
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

module.exports = mongoose.model('User', userSchema);
