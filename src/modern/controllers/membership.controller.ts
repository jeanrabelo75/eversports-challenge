import { Request, Response } from 'express'
import { ListMembershipsService } from '../services/list-memberships.service'
import { CreateMembershipService } from '../services/create-membership.service'
import { HttpError } from '../http/http-error'

export class MembershipController {
  static readonly list = (req: Request, res: Response) => {
    const rows = ListMembershipsService.execute()
    return res.status(200).json(rows)
  }

  static readonly create = (req: Request, res: Response) => {
    try {
      const result = CreateMembershipService.execute(req.body)
      return res.status(201).json(result)
    } catch (err) {
      if (err instanceof HttpError && err.status === 400) {
        return res.status(400).json({ message: err.message })
      }
      throw err
    }
  }
}
