import express from 'express'
import { MembershipController } from '../controllers/membership.controller'

const router = express.Router()

router.get('/', MembershipController.list)
router.post('/', MembershipController.create)

export default router
