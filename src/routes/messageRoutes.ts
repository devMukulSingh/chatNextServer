import { Router } from "express";
import {
  getMessagesController,
  postMessageController,
  deleteMessageController,
  editMessageController,
  uploadFileController,
  getFileController,
  downloadFileController,
} from "../controllers/messageController";
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({storage});

const messageRoutes = Router();

messageRoutes.post("/post-message", postMessageController);
messageRoutes.get("/get-messages", getMessagesController);
messageRoutes.delete(`/delete-message`, deleteMessageController);
messageRoutes.patch(`/edit-message`, editMessageController);
messageRoutes.post("/upload-file", upload.single("file"), uploadFileController);
messageRoutes.get("/get-file/:fileId", getFileController);
messageRoutes.get("/download-file/:fileId", downloadFileController);

export default messageRoutes;
