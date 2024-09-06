## Express + Prisma Startup Kit
  
- This api is built with express + typescript + postgresql + prisma
- [Prisma | Next-generation ORM for Node.js & TypeScript](https://www.prisma.io/)

#### Requirement
--- 
	Node.js 18.12.0 (preffered)
	npm 8.19.2 (preffered)

#### How to install
---

1. install server
 - Create env file for dula api
 - Set api keys on .env (DB path for prisma)
 > `cp .env.example .env`
 > `npm install`
---
2. run web app
> `npm run build & npm start`
> or on local environment
> `npm run dev`
Server will run on http://localhost:3001
  ---
3. Migration
> npx prisma migrate deploy
- It will create schema on postgresql
- Before migration, you need to update db connection information on env
---

4. Brief
- all routings are stored on src/routes with endpoints name
- it has guard to protect access 
	> defined on common/utils
	validateToken
	verifyToken
- for storage access, it is using aws-sdk/s3
	> common/s3.ts
- sub routings are defind inside each folder, and endpoint is defined as /api/[root]/[sub-root]
---
5. Deploy
If you want to deploy this code to any server, then open port 3001 only for it.