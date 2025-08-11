import express from 'express'
import { errorHandler } from './error-handler.middleware'
import membershipRoutes from './modern/routes/membership.routes'

const app = express()

app.use(express.json())
app.use('/memberships', membershipRoutes)
app.use(errorHandler)

export default app
