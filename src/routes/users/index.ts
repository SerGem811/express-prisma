import { Request, Response, Router } from 'express'
import { writeLog } from '../../common/utils'
import { PrismaClient } from '@prisma/client'
import {
  MiddlewareRequest,
  TypedMiddlewareRequest,
  TypedRequestBody
} from '../../common/types'
import { hashSync } from 'bcrypt'

const router: Router = Router()

const prisma = new PrismaClient()

router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany()

    return res.status(200).json(users)
  } catch (err) {
    writeLog(err?.message || err, `Ger user error!`)
    return res.status(500).json({ error: `Internal server error!` })
  }
})

router.post(
  '/',
  async (
    req: TypedRequestBody<{ name: string; email: string; password: string }>,
    res: Response
  ) => {
    try {
      const { name, email, password } = req.body
      const item = await prisma.user.create({
        data: {
          name,
          email,
          password: hashSync(password, 10)
        }
      })
      return res.status(201).send(item)
    } catch (err) {
      writeLog(err?.message || err, `User update error!`)
      return res.status(500).json({ error: `Internal server error!` })
    }
  }
)

router.put(
  '/:id',
  async (
    req: TypedMiddlewareRequest<{
      name?: string
      email?: string
      password?: string
    }>,
    res: Response
  ) => {
    try {
      const { id } = req.params as { id: string }
      const { name, email, password } = req.body

      await prisma.user.update({
        where: {
          id
        },
        data: {
          name,
          email,
          password: password ? hashSync(password, 10) : undefined
        }
      })
      return res.sendStatus(204)
    } catch (err) {
      writeLog(err?.message || err, `User update error!`)
      return res.status(500).json({ error: `Internal server error!` })
    }
  }
)

router.delete('/:id', async (req: MiddlewareRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string }
    await prisma.user.delete({
      where: {
        id
      }
    })
    return res.sendStatus(204)
  } catch (err) {
    writeLog(err?.message || err, `User update error!`)
    return res.status(500).json({ error: `Internal server error!` })
  }
})

module.exports = router
