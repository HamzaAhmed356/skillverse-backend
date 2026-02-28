import mongoose from "mongoose";
import Conversation from "../../Models/RTChatmodels/conversation.js";
import User from "../../Models/userschema.js";
export const newConversation = async (req, res) => {
  try {
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;
    if (senderId === receiverId) {
      return res
        .status(200)
        .json("You cannot start conversation with yourself");
    }
    console.log("hell owner", senderId, receiverId);
    const sortedMembers = [senderId, receiverId].sort();

    // Check if conversation already exists
    const exist = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (exist) {
      return res.status(200).json("Conversation already exists");
    }

    // Create new conversation
    const newConversation = new Conversation({
      members: [senderId, receiverId],
    });

    await newConversation.save();

    return res.status(200).json("Conversation saved successfully");
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error.message);
  }
};
export const getConversation = async (req, res) => {
  try {
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;
    console.log(typeof senderId);
    console.log(typeof receiverId);
    const data = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });
    console.log("get Data :" + data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// require sender (user id for this)
export const getAllConversation = async (req, res) => {
  try {
    const senderId = req.params.id;

    const data = await Conversation.find({
      members: { $in: [senderId] },
    }).sort({ updatedAt: -1 });

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getConversationUserData = async (req, res) => {
  try {
    const otherUserId = req.params.otherUserId;

    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    // Fetch user details
    const user = await User.findById(otherUserId).select("fullName profilePic");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
