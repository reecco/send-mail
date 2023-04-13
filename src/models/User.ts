import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  created_date: {
    type: Date,
    required: true
  },
  verified: {
    type: Boolean,
    required: true
  },
  image: Buffer,
  send_limit: {
    used: Number,
    limit: Number
  }
});

const User = mongoose.model("users", UserSchema);

export default User;