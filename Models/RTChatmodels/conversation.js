//conversation Schema
import mongoose from "mongoose";
const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array, //contain sender and receiver id
    },
    message: {
      type: String, //for last message shown in conversation card
    },
  },
  {
    timestamps: true, //hit current time
  },
);
const conversation = mongoose.model("Conversation", ConversationSchema);
export default conversation;
