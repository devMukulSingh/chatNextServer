import { Router } from "express";
import {
  getMessagesController,
  postMessageController,
  deleteMessageController,
  editMessageController,
  // downloadFileController,
  uploadFileController,
} from "../controllers/messageController";
import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({ storage });

const messageRoutes = Router();

messageRoutes.post("/post-message", postMessageController);
messageRoutes.get("/get-messages", getMessagesController);
messageRoutes.delete(`/delete-message`, deleteMessageController);
messageRoutes.patch(`/edit-message`, editMessageController);
messageRoutes.post("/upload-file", upload.single("file"), uploadFileController);
// messageRoutes.get("/download-file/:fileId", downloadFileController);

export default messageRoutes;
