import { MembershipController } from '../../src/modern/controllers/membership.controller'
import { ListMembershipsService } from '../../src/modern/services/list-memberships.service'
import { CreateMembershipService } from '../../src/modern/services/create-membership.service'
import { HttpError } from '../../src/modern/http/http-error'

const mockRes = () => {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('MembershipController', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('list', () => {
    it('returns 200 with rows from ListMembershipsService', () => {
      const rows = [
        {
          membership: {
            id: 1,
            uuid: 'u-1',
            name: 'Gold',
            recurringPrice: 100,
            validFrom: new Date('2023-01-01'),
            validUntil: new Date('2023-12-31'),
            state: 'active',
            paymentMethod: 'credit card',
            billingInterval: 'monthly',
            billingPeriods: 12,
          },
          periods: [],
        },
      ]

      const spy = jest
        .spyOn(ListMembershipsService, 'execute')
        .mockReturnValue(rows as any)

      const req: any = {}
      const res = mockRes()

      MembershipController.list(req, res)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(rows)
    })
  })

  describe('create', () => {
    it('returns 201 with result from CreateMembershipService on success', () => {
      const body = {
        name: 'Test Plan',
        recurringPrice: 100,
        paymentMethod: 'credit card',
        billingInterval: 'monthly' as const,
        billingPeriods: 6,
        validFrom: '2023-01-01',
      }

      const result = {
        membership: {
          id: 999,
          uuid: 'u-999',
          name: 'Test Plan',
          recurringPrice: 100,
          validFrom: new Date('2023-01-01'),
          validUntil: new Date('2023-07-01'),
          state: 'active',
          user: 2000,
          paymentMethod: 'credit card',
          billingInterval: 'monthly',
          billingPeriods: 6,
        },
        membershipPeriods: [
          {
            id: 1,
            uuid: 'p-1',
            membershipId: 999,
            start: new Date('2023-01-01'),
            end: new Date('2023-02-01'),
            state: 'planned',
          },
        ],
      }

      const spy = jest
        .spyOn(CreateMembershipService, 'execute')
        .mockReturnValue(result as any)

      const req: any = { body }
      const res = mockRes()

      MembershipController.create(req, res)

      expect(spy).toHaveBeenCalledWith(body)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(result)
    })

    it('returns 400 with { message } when service throws HttpError(400, ...)', () => {
      const body = {
        name: '',
        recurringPrice: 0,
        billingInterval: 'monthly' as const,
        billingPeriods: 6,
      }

      jest
        .spyOn(CreateMembershipService, 'execute')
        .mockImplementation(() => {
          throw new HttpError(400, 'missingMandatoryFields')
        })

      const req: any = { body }
      const res = mockRes()

      MembershipController.create(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: 'missingMandatoryFields' })
    })

    it('rethrows non-Http errors', () => {
      jest
        .spyOn(CreateMembershipService, 'execute')
        .mockImplementation(() => {
          throw new Error('boom')
        })

      const req: any = { body: {} }
      const res = mockRes()

      expect(() => MembershipController.create(req, res)).toThrow('boom')
      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
    })
  })
})
