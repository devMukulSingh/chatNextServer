import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { renameSync } from "fs";
import { BASE_URL_SERVER } from "../lib/BASE_URL";
import { deleteObject, getObjectURL, putObject } from "../aws";
const path = require("path");
import axios from "axios";

export async function postMessageController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { message, senderId, receiverId } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    if (!senderId) {
      res.status(400).json({ error: "senderId is required" });
      return;
    }

    if (!receiverId) {
      res.status(400).json({ error: "receiverId is required" });
      return;
    }

    const messages = await prisma.message.create({
      data: {
        senderUser: {
          connect: { id: senderId },
        },
        receiverUser: {
          connect: { id: receiverId },
        },
        message,
      },
    });

    res.status(201).json(messages);
    return;
  } catch (e) {
    res.status(500).json(`Error in postMessageController ${e}`);
    console.log(`Error in postMessageController ${e}`);
    next(e);
    return;
  }
}

export async function getMessagesController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const senderId = req.query.senderId?.toString();
    const receiverId = req.query.receiverId?.toString();

    if (!senderId) {
      res.status(400).json({ error: "senderId is required" });
      return;
    }

    if (!receiverId) {
      res.status(400).json({ error: "receiverId is required" });
      return;
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId,
            receiverId,
          },
          {
            senderId: receiverId,
            receiverId: senderId,
          },
        ],
      },
    });

    for (let message of messages) {
      if (message.type === "file") {
        const imageUrl = await getObjectURL(message.message);
        message.message = imageUrl;
      }
    }

    res.status(200).json(messages);
    return;
  } catch (e) {
    res.status(500).json(`Error in postMessageController ${e}`);
    console.log(`Error in postMessageController ${e}`);
    next(e);
    return;
  }
}

export async function deleteMessageController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const messageId = req.query.messageId?.toString();

    if (!messageId) {
      res.status(400).json({ error: "MessageId is required" });
      return;
    }
    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });
    if (!message) {
      return res.status(400).json({ error: "no Message found" });
    }
    if (message.type === "file") {
      await deleteObject(message.message);
    }

    await prisma.message.delete({
      where: {
        id: messageId,
      },
    });

    res.status(200).json(message);
    return;
  } catch (e) {
    next(e);
  }
}

export async function editMessageController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { messageId, message } = req.body;

    if (!messageId) {
      res.status(400).json({ error: "MessageId is required" });
      return;
    }

    if (!message) {
      res.status(400).json({ error: "message is required" });
      return;
    }

    const response = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        message,
      },
    });

    res.status(200).json(response);
    return;
  } catch (e) {
    next(e);
  }
}
export async function uploadFileController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const file = req.file;
    const senderId = req.query.senderId?.toString();
    const receiverId = req.query.receiverId?.toString();
    const type = req.file?.mimetype || "";
    const filePath = req.file?.path || "";

    if (!file) return res.status(400).json({ error: `File is required` });
    if (!senderId)
      return res.status(400).json({ error: `senderId is required` });
    if (!receiverId)
      return res.status(400).json({ error: `receiverId is required` });

    const filename = file?.filename || "";
    const key = `uploads/file-message/${Date.now()}-${filename}`;

    const url = await putObject({
      key,
      contentType: type,
    });

    const response = await axios.put(url, file.buffer, {
      headers: {
        "Content-Type": type,
      },
    });

    const message = await prisma.message.create({
      data: {
        senderUser: {
          connect: { id: senderId },
        },
        receiverUser: {
          connect: { id: receiverId },
        },
        message: key,
        type: "file",
      },
    });
    const imageUrl = await getObjectURL(key);

    return res.status(201).json(imageUrl);
  } catch (e) {
    console.log(`Error in uploadFileController ${e}`);
    return res
      .status(500)
      .json({ error: `Error in uploadFileController ${e}` });
  }
}

// export async function getFileController(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//     const fileId = req.params.fileId.toString();

//     if (!fileId) {
//       res.status(400).json({ error: "File id is required" });
//       return;
//     }

//     const fileByFileId = await prisma.message.findUnique({
//       where: {
//         id: fileId,
//       },
//     });

//     if (!fileByFileId?.fileName) {
//       res.status(404).json({ error: "No such file found" });
//       return;
//     }

//     res.status(200).sendFile(fileByFileId?.fileName, { root: "uploads" });
//     return;
//   } catch (e) {
//     next(e);
//   }
// }

// export async function downloadFileController(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//     const fileId = req.params.fileId.toString();
//     console.log(fileId);

//     if (!fileId) {
//       res.status(400).json({ error: "File id is required" });
//     }

//     const file = await prisma.message.findUnique({
//       where: {
//         id: fileId,
//       },
//     });
//     console.log(file);

//     if (!file) {
//       res.status(404).json({ error: "No such file found" });
//       return;
//     }
//     const fileName = file.fileName || "";

//     const filePath = path.join(__dirname, `../../uploads/${fileName}`);

//     res.download(filePath, fileName, (e) => {
//       console.log(e);
//     });
//   } catch (e) {
//     next(e);
//   }
// }
