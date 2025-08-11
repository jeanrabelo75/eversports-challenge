import type { BillingInterval } from '../domain/types'
import { CreateMembershipDto } from '../dtos/create-membership.dto'
import { HttpError } from '../http/http-error'

const badRequest = (message: string) => new HttpError(400, message)

const baseRules: Array<(i: CreateMembershipDto) => HttpError | null> = [
  (i) =>
    !i.name || !i.recurringPrice ? badRequest('missingMandatoryFields') : null,
  (i) =>
    (i.recurringPrice ?? 0) < 0 ? badRequest('negativeRecurringPrice') : null,
  (i) =>
    (i.recurringPrice ?? 0) > 100 && i.paymentMethod === 'cash'
      ? badRequest('cashPriceBelow100')
      : null,
]

const intervalValidators: Partial<
  Record<BillingInterval, (periods: number) => string | undefined>
> = {
  monthly: (p) => (p > 12 ? 'billingPeriodsMoreThan12Months' : undefined),
  yearly: (p) => {
    if (p > 10) return 'billingPeriodsMoreThan10Years'
    if (p > 3) return 'billingPeriodsLessThan3Years'
    return undefined
  },
}

export function validateCreateMembership(input: CreateMembershipDto): void {
  for (const rule of baseRules) {
    const err = rule(input)
    if (err) throw err
  }

  const validator = intervalValidators[input.billingInterval]
  if (!validator) {
    throw badRequest('invalidBillingPeriods')
  }

  const message = validator(input.billingPeriods)
  if (message) {
    throw badRequest(message)
  }
}
