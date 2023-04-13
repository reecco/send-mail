import mongoose, { Schema } from "mongoose";

const VerifiedTokenSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  used: {
    type: Boolean,
    required: true
  }
});

const VerifiedToken = mongoose.model("tokens", VerifiedTokenSchema);

export default VerifiedToken;