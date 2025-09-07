const mongoose = require('mongoose');
require('dotenv').config(); // to read .env locally

// ✅ Use environment variable instead of hardcoding localhost
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  name: String,
  password: String,
  age: Number,
  profilepic: {
    type: String,
    default: "image.png"
  },
  post: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post"
    }
  ],
});

module.exports = mongoose.model("user", userSchema);
