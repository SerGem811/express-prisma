import 'dotenv/config'
import { NextFunction, Response, Router } from 'express'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import fs from 'fs'
// import { RedisClientType, createClient } from 'redis'

import { MiddlewareRequest } from './types'

interface UserTokenInterface {
  id: number
  email: string
}

interface EmailTokenInterface {
  email: string
}

export const generateAccessToken = async (
  email: string,
  id: number,
  expiresIn: number = 30
) => {
  const token = jwt.sign({ email, id }, `${process.env.TOKEN_SECRET}`, {
    expiresIn: `${expiresIn}d`
  })

  return token
}

export const generateVerifyToken = async (
  email: string,
  expiresIn: number = 1
) => {
  const token = jwt.sign({ email }, `${process.env.TOKEN_SECRET}`, {
    expiresIn
  })
  return token
}

export const validateToken = async (
  req: MiddlewareRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token === null) {
    return res.sendStatus(401)
  }

  jwt.verify(
    token || '',
    process.env.TOKEN_SECRET || '',
    async (err: VerifyErrors, decoded: UserTokenInterface) => {
      if (err) return res.sendStatus(401)
      const user = await prisma.user.findUnique({
        where: {
          id: decoded?.id
        }
      })
      if (!user) return res.sendStatus(401)
      req.tokenData = user
      next()
    }
  )
}

export const verifyToken = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.TOKEN_SECRET,
      async (err: VerifyErrors, decoded: EmailTokenInterface) => {
        if (err) reject(`Invalid token!`)
        resolve(decoded?.email)
      }
    )
  })
}

export const customFormatDate = (time: any, snooze: any, offset?: any) => {
  let date = new Date()
  const currentDate = new Date(
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${time}`
  )
  const timezoneOffset = offset
    ? currentDate.getTimezoneOffset() * 60 * 10000
    : 0
  currentDate.setTime(currentDate.getTime() + snooze * 1000 + timezoneOffset)
  let hours = currentDate.getHours()
  const minutes = currentDate.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const h = !hours
    ? '00'
    : hours % 12
    ? hours % 12 < 10
      ? '0' + (hours % 12)
      : hours % 12
    : 12
  const mi = minutes < 10 ? '0' + minutes : minutes
  return `${h}:${mi} ${ampm}`
}

export const writeLog = (msg: string, prefix: string = '') => {
  try {
    const today = new Date()
    if (!fs.existsSync(`logs`)) {
      fs.mkdirSync(`logs`)
    }
    fs.appendFileSync(
      `logs/${today.getFullYear()}-${
        today.getMonth() + 1
      }-${today.getDate()}.log`,
      `${today.toUTCString()}, ${prefix} Error: ${msg}\n`
    )
  } catch (err) {
    console.log(err)
  }
}
