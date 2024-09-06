import 'dotenv/config'
import aws from 'aws-sdk'
import fs from 'fs'
import multer from 'multer'
import multerS3 from 'multer-s3'

const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
  signatureVersion: 'v4'
})

export const upload = async (blob: Buffer, Key: string) => {
  return new Promise(async (resolve) => {
    try {
      await s3
        .upload({
          Bucket: process.env.S3_BUCKET_NAME,
          Key,
          Body: blob
        })
        .promise()
      resolve(true)
    } catch (err) {
      resolve(false)
    }
  })
}

export const uploadImage = async (localPath: string, Key: string) => {
  return new Promise(async (resolve) => {
    try {
      const blob = fs.readFileSync(localPath)
      await s3
        .upload({
          Bucket: process.env.S3_BUCKET_NAME,
          Key,
          Body: blob
        })
        .promise()
      resolve(true)
    } catch (err) {
      resolve(false)
    }
  })
}

export const deleteFromS3 = async (Key: string) => {
  return new Promise(async (resolve) => {
    s3.deleteObject(
      {
        Bucket: process.env.S3_BUCKET_NAME,
        Key
      },
      (err, data) => {
        if (err) resolve(false)
        resolve(true)
      }
    )
  })
}

export const uploadMulter = (prefix: string) => {
  return multer({
    storage: multerS3({
      s3,
      bucket: process.env.S3_BUCKET_NAME,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname })
      },
      key: (req, file, cb) => {
        cb(null, `${prefix}/${Date.now()}-${file.originalname}`)
      }
    })
  })
}

export const uploadUserMulter = () => {
  return multer({
    storage: multerS3({
      s3,
      bucket: process.env.S3_BUCKET_NAME,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname })
      },
      key: (req, file, cb) => {
        // @ts-ignore
        const userId = req.tokenData.id
        // @ts-ignore
        const prefix = req.body.type // prefix can be bp, glucose etc
        cb(null, `dula/${userId}/${prefix}/${Date.now()}-${file.originalname}`)
      }
    })
  })
}

export const uploadAudioMulter = (prefix: string) => {
  return multer({
    storage: multerS3({
      s3,
      bucket: process.env.S3_BUCKET_NAME,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname })
      },
      key: (req, file, cb) => {
        cb(null, `${prefix}/${Date.now()}-${file.originalname}.mp3`)
      }
    }),
    fileFilter: (req, file, cb) => {
      // Ensure only audio files are accepted (adjust MIME types accordingly)
      if (file.mimetype.startsWith('audio/')) {
        cb(null, true)
      } else {
        cb(null, false)
      }
    }
  })
}
