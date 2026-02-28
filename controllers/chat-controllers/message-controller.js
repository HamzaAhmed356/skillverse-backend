import Conversation from "../../Models/RTChatmodels/conversation.js";
import Message from "../../Models/RTChatmodels/message.js";

/** let message = {
        senderId: account.sub,
        receiverId: person.sub,
        conversationId: conversation._id,
        type: "text",
        text: value,
      }; new message will receive this */
export const newMessage = async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();
    //attaching with convesation of person for last message show in conversation (frontend)
    await Conversation.findByIdAndUpdate(req.body.conversationId, {
      message: req.body.text,
    });

    return res.status(200).json("message saved successfully");
  } catch (error) {
    return res.status(500).json("errror during adding Message ", error);
  }
};

export const getMessage = async (req, res) => {
  try {
    const meassages = await Message.find({
      conversationId: req.params.id,
    });
    return res.status(200).json(meassages);
  } catch (error) {
    return res.status(500).json("error while retrieving messages");
  }
};
