import { createExpressMiddleware } from "@trpc/server/adapters/express"
import express from "express"
import cors from "cors"
import { appRouter } from "./routers"

const app = express()
app.use(cors({ origin: "http://localhost:8080" }))

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }) => {
      return {}
    },
  })
)

const server = app.listen(3001, () => {
  console.log('tRPC Server running on port 3001');
})

module.exports = { server }
