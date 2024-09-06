import { User } from '@prisma/client'
import { Request } from 'express'


export interface TypedRequestBody<T> extends Request {
  body: T
}

export interface MiddlewareRequest extends Request {
  tokenData: User
}

export interface TypedMiddlewareRequest<T> extends Request {
  body: T
  tokenData: User
}
