const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    //an object because a blog can only have one user
    //this type is defined as an ObjID so that ...
    //it can serve as a valid reference to a mongo document ...
    //this would not work if it were just an ordinary string ...
    //as mongoDB documents are assigned an _id of ObjectID type
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

// format the default IDs set by mongoDB to strings
blogSchema.set('toJSON', {
  transform: (document, obj) => {
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
  },
});

module.exports = mongoose.model('Blog', blogSchema);

