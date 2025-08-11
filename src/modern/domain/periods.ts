import { BillingInterval } from './types'

export function computeValidUntil(
  validFrom: Date,
  billingInterval: BillingInterval,
  billingPeriods: number,
): Date {
  const validUntil = new Date(validFrom)
  if (billingInterval === 'monthly') {
    validUntil.setMonth(validFrom.getMonth() + billingPeriods)
  } else if (billingInterval === 'yearly') {
    validUntil.setMonth(validFrom.getMonth() + billingPeriods * 12)
  } else if (billingInterval === 'weekly') {
    validUntil.setDate(validFrom.getDate() + billingPeriods * 7)
  }
  return validUntil
}

export function generatePeriodRanges(
  startAt: Date,
  billingInterval: BillingInterval,
  periods: number,
): Array<{ start: Date; end: Date }> {
  const ranges: Array<{ start: Date; end: Date }> = []
  let cursor = startAt
  for (let i = 0; i < periods; i++) {
    const start = cursor
    const end = new Date(start)
    if (billingInterval === 'monthly') {
      end.setMonth(start.getMonth() + 1)
    } else if (billingInterval === 'yearly') {
      end.setMonth(start.getMonth() + 12)
    } else if (billingInterval === 'weekly') {
      end.setDate(start.getDate() + 7)
    }
    ranges.push({ start, end })
    cursor = end
  }
  return ranges
}
