import { t } from "../trpc"
import { z } from "zod"
import { usersRouter } from "./users"

export const appRouter = t.router({
  greeting: t.procedure
    .input(z.object({ name: z.string() }))
    .query(requestObj => {
      console.log(requestObj)
      return `Hello ${requestObj.input.name}`
    }),
  errors: t.procedure.query(() => {
    throw new Error("This is an error message")
  }),
  users: usersRouter,
})

export type AppRouter = typeof appRouter
