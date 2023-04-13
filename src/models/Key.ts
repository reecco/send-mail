import mongoose, { Schema } from "mongoose";

const KeySchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  created_date: {
    type: Date,
    required: true
  }
});

const Key = mongoose.model("keys", KeySchema);

export default Key;