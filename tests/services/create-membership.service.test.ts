import type { BillingInterval, PaymentMethod } from '../../src/modern/domain/types'
import type { CreateMembershipDto } from '../../src/modern/dtos/create-membership.dto'
import { MembershipRepository } from '../../src/modern/repositories/membership.repository'
import { CreateMembershipService } from '../../src/modern/services/create-membership.service'

jest.mock('uuid', () => ({ v4: () => '00000000-0000-0000-0000-000000000000' }))

describe('CreateMembershipService', () => {
  const baseLen = MembershipRepository.getAll().length

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2023-01-01T00:00:00Z'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  afterEach(() => {
    const arr = MembershipRepository.getAll() as any[]
    arr.splice(baseLen)
  })

  it('creates membership and periods correctly (monthly)', () => {
    const input: CreateMembershipDto = {
      name: 'Test Plan',
      recurringPrice: 100,
      paymentMethod: 'credit card' as PaymentMethod,
      billingInterval: 'monthly' as BillingInterval,
      billingPeriods: 6,
      validFrom: '2023-01-01',
    }

    const before = MembershipRepository.getAll().length
    const result = CreateMembershipService.execute(input)
    const after = MembershipRepository.getAll().length

    expect(after).toBe(before + 1)

    expect(result.membership.user).toBe(2000)
    expect(result.membership.name).toBe('Test Plan')
    expect(result.membership.recurringPrice).toBe(100)
    expect(result.membership.billingInterval).toBe('monthly')
    expect(result.membership.billingPeriods).toBe(6)
    expect(result.membership.state).toBe('active')

    const from = result.membership.validFrom as Date
    const until = result.membership.validUntil as Date
    expect(from).toBeInstanceOf(Date)
    expect(until).toBeInstanceOf(Date)

    expect(from.toISOString()).toBe('2023-01-01T00:00:00.000Z')

    const expectedUntil = new Date(from)
    expectedUntil.setMonth(from.getMonth() + 6)
    expect(until.getTime()).toBe(expectedUntil.getTime())
    expect(result.membershipPeriods).toHaveLength(6)

    for (const p of result.membershipPeriods) {
      expect(p.membershipId).toBe(result.membership.id)
      expect(p.state).toBe('planned')
      expect(p.start).toBeInstanceOf(Date)
      expect(p.end).toBeInstanceOf(Date)
    }
    for (let i = 1; i < result.membershipPeriods.length; i++) {
      expect(
        (result.membershipPeriods[i].start as Date).getTime(),
      ).toBe((result.membershipPeriods[i - 1].end as Date).getTime())
    }
  })

  it('throws invalidBillingPeriods for unsupported interval (weekly)', () => {
    const dto: CreateMembershipDto = {
      name: 'Weekly',
      recurringPrice: 50,
      paymentMethod: 'credit card' as PaymentMethod,
      billingInterval: 'weekly' as BillingInterval,
      billingPeriods: 8,
    }
    expect(() => CreateMembershipService.execute(dto)).toThrow('invalidBillingPeriods')
  })

  it('throws yearly limits according to legacy rules', () => {
    const dtoMoreThan10: CreateMembershipDto = {
      name: 'Yearly',
      recurringPrice: 50,
      paymentMethod: 'credit card' as PaymentMethod,
      billingInterval: 'yearly' as BillingInterval,
      billingPeriods: 11,
    }
    expect(() => CreateMembershipService.execute(dtoMoreThan10))
      .toThrow('billingPeriodsMoreThan10Years')

    const dtoLessThan3: CreateMembershipDto = {
      name: 'Yearly',
      recurringPrice: 50,
      paymentMethod: 'credit card' as PaymentMethod,
      billingInterval: 'yearly' as BillingInterval,
      billingPeriods: 4,
    }
    expect(() => CreateMembershipService.execute(dtoLessThan3))
      .toThrow('billingPeriodsLessThan3Years')
  })

  it('creates with default validFrom = now when not provided', () => {
    const input = {
      name: 'No From',
      recurringPrice: 80,
      paymentMethod: 'credit card' as PaymentMethod,
      billingInterval: 'monthly' as BillingInterval,
      billingPeriods: 1,
    }

    const result = CreateMembershipService.execute(input)
    expect((result.membership.validFrom as Date).getTime())
      .toBe(new Date('2023-01-01T00:00:00.000Z').getTime())
    expect(result.membership.state).toBe('active')
  })

  it('sets state to pending when validFrom is in the future', () => {
    const input = {
      name: 'Future',
      recurringPrice: 80,
      paymentMethod: 'credit card' as PaymentMethod,
      billingInterval: 'monthly' as BillingInterval,
      billingPeriods: 1,
      validFrom: '2023-02-01',
    }

    const result = CreateMembershipService.execute(input)
    expect(result.membership.state).toBe('pending')
  })
  it('sets state to expired when validUntil is in the past', () => {
    const input = {
      name: 'Expired',
      recurringPrice: 80,
      paymentMethod: 'credit card' as PaymentMethod,
      billingInterval: 'monthly' as BillingInterval,
      billingPeriods: 1,
      validFrom: '2022-01-01',
    }
    const result = CreateMembershipService.execute(input)
    expect(result.membership.state).toBe('expired')
  })
  it('sets paymentMethod to null when not provided', () => {
    const input = {
      name: 'No PM',
      recurringPrice: 80,
      billingInterval: 'monthly' as BillingInterval,
      billingPeriods: 1,
      validFrom: '2023-01-01',
    }

    const result = CreateMembershipService.execute(input)
    expect(result.membership.paymentMethod).toBeNull()
  })
})
