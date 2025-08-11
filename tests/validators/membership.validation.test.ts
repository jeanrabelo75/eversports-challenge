import type { CreateMembershipDto } from '../../src/modern/dtos/create-membership.dto'
import { validateCreateMembership } from '../../src/modern/validators/membership.validation'

describe('validateCreateMembership', () => {
  const base: CreateMembershipDto = {
    name: 'Test Plan',
    recurringPrice: 100,
    paymentMethod: 'credit card',
    billingInterval: 'monthly',
    billingPeriods: 6,
  }

  it('throws missingMandatoryFields when name is missing', () => {
    const dto = {
      ...base,
    } as any
    delete dto.name

    expect(() => validateCreateMembership(dto)).toThrow('missingMandatoryFields')
  })

  it('throws missingMandatoryFields when recurringPrice is 0 (legacy quirk)', () => {
    const dto: CreateMembershipDto = { ...base, recurringPrice: 0 }
    expect(() => validateCreateMembership(dto)).toThrow('missingMandatoryFields')
  })

  it('throws negativeRecurringPrice when price < 0', () => {
    const dto: CreateMembershipDto = { ...base, recurringPrice: -1 }
    expect(() => validateCreateMembership(dto)).toThrow('negativeRecurringPrice')
  })

  it('throws cashPriceBelow100 when price > 100 and paymentMethod is cash', () => {
    const dto: CreateMembershipDto = {
      ...base,
      recurringPrice: 101,
      paymentMethod: 'cash',
    }
    expect(() => validateCreateMembership(dto)).toThrow('cashPriceBelow100')
  })

  it('monthly: throws billingPeriodsMoreThan12Months when > 12', () => {
    const dto: CreateMembershipDto = { ...base, billingPeriods: 13 }
    expect(() => validateCreateMembership(dto)).toThrow(
      'billingPeriodsMoreThan12Months',
    )
  })

  it('yearly: throws billingPeriodsLessThan3Years when 4', () => {
    const dto: CreateMembershipDto = {
      ...base,
      billingInterval: 'yearly',
      billingPeriods: 4,
    }
    expect(() => validateCreateMembership(dto)).toThrow(
      'billingPeriodsLessThan3Years',
    )
  })

  it('yearly: throws billingPeriodsMoreThan10Years when 11', () => {
    const dto: CreateMembershipDto = {
      ...base,
      billingInterval: 'yearly',
      billingPeriods: 11,
    }
    expect(() => validateCreateMembership(dto)).toThrow(
      'billingPeriodsMoreThan10Years',
    )
  })

  it('weekly: throws invalidBillingPeriods (unsupported interval)', () => {
    const dto: CreateMembershipDto = {
      ...base,
      billingInterval: 'weekly',
      billingPeriods: 8,
    }
    expect(() => validateCreateMembership(dto)).toThrow('invalidBillingPeriods')
  })

  it('valid monthly (<=12) does not throw', () => {
    const dto: CreateMembershipDto = { ...base, billingPeriods: 12 }
    expect(() => validateCreateMembership(dto)).not.toThrow()
  })

  it('valid yearly (=3) does not throw', () => {
    const dto: CreateMembershipDto = {
      ...base,
      billingInterval: 'yearly',
      billingPeriods: 3,
    }
    expect(() => validateCreateMembership(dto)).not.toThrow()
  })

  it('throws missingMandatoryFields when recurringPrice is undefined', () => {
    expect(() =>
      validateCreateMembership({
        name: 'Gold',
        billingInterval: 'monthly',
        billingPeriods: 6,
      } as any),
    ).toThrow('missingMandatoryFields')
  })

  it('cash with price <= 100 is allowed (does not throw)', () => {
    expect(() =>
      validateCreateMembership({
        name: 'Cash OK',
        recurringPrice: 100,
        paymentMethod: 'cash',
        billingInterval: 'monthly',
        billingPeriods: 6,
      }),
    ).not.toThrow()
  })
})
