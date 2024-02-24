import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function addUserControllers (req: Request, res: Response) {
    
  const { email, name, password } = req.body
  console.log(email, name, password)

  if (!email) {
    res.status(400).json({ error: 'email is required' })
    return
  }
  if (!password) {
    res.status(400).json({ error: 'password is required' })
    return
  }
  if (!name) {
    res.status(400).json({ error: 'name is required' })
    return
  }

  const userExists = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (userExists) {
    res.status(400).json({ error: 'User already exists' })
    return
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword
    }
  })

  const token = jwt.sign(
    {
      email,
      name
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '1d'
    }
  )

    res.cookie('token',token,{
        httpOnly:true,
    })

  res.status(201).json({ newUser })
}

export async function checkUserController (req: Request, res: Response) {}
