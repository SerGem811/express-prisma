import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'

import 'dotenv/config'

const app = express()
const port = process.env.PORT || '3001'

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 60 request per 1minutes, it is for each IP
  limit: 60
})

app.use(limiter)
app.use(helmet())
const allowedOrigins = ['http://localhost:3000'] // Add your allowed domains here

const corsOptions = {
  origin: function (origin: any, callback: any) {
    // Check if the origin is in the list of allowed origins or if it's undefined (for local development)
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions))
app.use(morgan('tiny'))

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
