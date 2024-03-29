import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const { message } = req.body;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // await newMessage.save();
    // await conversation.save();

    // this will run in parallel
    await Promise.all([newMessage.save(), conversation.save()]);

    return res.status(201).json(newMessage);
  } catch (error) {
    console.log("error in sendMessage controller", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatID } = req.params;
    const currentUserId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: {
        $all: [currentUserId, userToChatID],
      },
    }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

    if(!conversation) return res.status.json([]);
    
    return res.status(200).json(conversation.messages);
  } catch (error) {
    console.log("error in getMessages controller", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
