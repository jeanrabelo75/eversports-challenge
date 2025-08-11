import { BillingInterval, PaymentMethod } from '../domain/types'

export interface CreateMembershipDto {
  name?: string
  recurringPrice?: number
  paymentMethod?: PaymentMethod | null
  billingInterval: BillingInterval
  billingPeriods: number
  validFrom?: string
}
