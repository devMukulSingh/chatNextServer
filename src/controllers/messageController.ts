import { NextFunction, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { renameSync } from 'fs'
import { BASE_URL } from '../lib/BASE_URL'
const path = require('path')

export async function postMessageController (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { message, senderId, receiverId } = req.body

    if (!message) {
      res.status(400).json({ error: 'Message is required' })
      return
    }

    if (!senderId) {
      res.status(400).json({ error: 'senderId is required' })
      return
    }

    if (!receiverId) {
      res.status(400).json({ error: 'receiverId is required' })
      return
    }

    const messages = await prisma.message.create({
      data: {
        senderUser: {
          connect: { id: senderId }
        },
        receiverUser: {
          connect: { id: receiverId }
        },
        message
      }
    })

    res.status(201).json(messages)
    return
  } catch (e) {
    res.status(500).json(`Error in postMessageController ${e}`)
    console.log(`Error in postMessageController ${e}`)
    next(e)
    return
  }
}

export async function getMessagesController (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const senderId = req.query.senderId?.toString()
    const receiverId = req.query.receiverId?.toString()

    if (!senderId) {
      res.status(400).json({ error: 'senderId is required' })
      return
    }

    if (!receiverId) {
      res.status(400).json({ error: 'receiverId is required' })
      return
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId,
            receiverId
          },
          {
            senderId: receiverId,
            receiverId: senderId
          }
        ]
      }
    })

    res.status(200).json(messages)
    return
  } catch (e) {
    res.status(500).json(`Error in postMessageController ${e}`)
    console.log(`Error in postMessageController ${e}`)
    next(e)
    return
  }
}

export async function deleteMessageController (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const messageId = req.query.messageId?.toString()

    if (!messageId) {
      res.status(400).json({ error: 'MessageId is required' })
      return
    }

    const message = await prisma.message.delete({
      where: {
        id: messageId
      }
    })

    res.status(200).json(message)
    return
  } catch (e) {
    next(e)
  }
}

export async function editMessageController (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { messageId, message } = req.body

    if (!messageId) {
      res.status(400).json({ error: 'MessageId is required' })
      return
    }

    if (!message) {
      res.status(400).json({ error: 'message is required' })
      return
    }

    const response = await prisma.message.update({
      where: {
        id: messageId
      },
      data: {
        message
      }
    })

    res.status(200).json(response)
    return
  } catch (e) {
    next(e)
  }
}

export async function uploadFileController (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(req.file)

    const file = req.file
    const senderId = req.query.senderId?.toString()
    const receiverId = req.query.receiverId?.toString()
    const type = req.query.type?.toString()
    const filePath = req.file?.path || ''

    if (!file) {
      res.status(400).json({ error: 'File is required' })
      return
    }
    if (!senderId) {
      res.status(400).json({ error: 'SenderId is required' })
      return
    }
    if (!receiverId) {
      res.status(400).json({ error: 'receiverId is required' })
      return
    }
    if (!type) {
      res.status(400).json({ error: 'type is required' })
      return
    }

    const fileMessage = await prisma.message.create({
      data: {
        receiverId,
        senderId,
        type,
        filePath,
        fileName: req.file?.filename
      }
    })
    res.status(201).json({
      path: `${BASE_URL}/api/message/get-file/${fileMessage.id}`,
      id: fileMessage.id
    })

    return
  } catch (e) {
    next(e)
  }
}

export async function getFileController (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const fileId = req.params.fileId.toString()

    if (!fileId) {
      res.status(400).json({ error: 'File id is required' })
      return
    }

    const fileByFileId = await prisma.message.findUnique({
      where: {
        id: fileId
      }
    })

    if (!fileByFileId?.fileName) {
      res.status(404).json({ error: 'No such file found' })
      return
    }

    res.status(200).sendFile(fileByFileId?.fileName, { root: 'uploads' })
    return
  } catch (e) {
    next(e)
  }
}



export async function downloadFileController (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const fileId = req.params.fileId.toString()
    console.log(fileId)

    if (!fileId) {
      res.status(400).json({ error: 'File id is required' })
    }

    const file = await prisma.message.findUnique({
      where: {
        id: fileId
      }
    })
    console.log(file)

    if (!file) {
      res.status(404).json({ error: 'No such file found' })
      return
    }
    const fileName = file.fileName || ''

    const filePath = path.join(__dirname, `../../uploads/${fileName}`)

    res.download(filePath,fileName, (e) => {
      console.log(e)
    });
    
  } catch (e) {
    next(e)
  }
}
