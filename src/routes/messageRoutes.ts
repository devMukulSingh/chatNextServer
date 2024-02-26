import { Router } from "express";
import { getMessagesController, postMessageController,deleteMessageController,editMessageController } from "../controllers/messageController";


const messageRoutes = Router();

messageRoutes.post('/post-message',postMessageController);
messageRoutes.get('/get-messages',getMessagesController);
messageRoutes.delete(`/delete-message`,deleteMessageController);
messageRoutes.patch(`/edit-message`,editMessageController);


export default messageRoutes;