//import { uploadFile } from "../controllers/chat-controllers/";
//import upload from "../utils/upload.js";

import express from "express";
import { addUser, getUsers } from "../controllers/chat-controllers/addUser.js";

import {
  newConversation,
  getConversation,
  getAllConversation,
  getConversationUserData,
} from "../controllers/chat-controllers/conversation-controller.js";
import {
  newMessage,
  getMessage,
} from "../controllers/chat-controllers/message-controller.js";

const router = express.Router();

router.post("/add", addUser); //add user
router.get("/getUsers", getUsers); //get users
router.post("/conversation/add", newConversation); //add conversation
router.post("/conversation/get", getConversation); //conversation send to frontend
router.post("/message/add", newMessage); //add message
router.get("/message/get/:id", getMessage); //get Message
router.get("/conversations/get/:id", getAllConversation);
router.get("/user/:otherUserId", getConversationUserData);
//router.post("/file/upload", upload.single("file"), uploadFile);
export default router;
