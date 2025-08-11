export type BillingInterval = 'monthly' | 'yearly' | 'weekly'
export type PaymentMethod = 'credit card' | 'cash'
export type MembershipState = 'active' | 'pending' | 'expired'
export type MembershipPeriodState = 'planned' | 'issued'

export const BillingIntervals: ReadonlyArray<BillingInterval> = [
  'monthly',
  'yearly',
  'weekly',
]

export const PaymentMethods: ReadonlyArray<PaymentMethod> = [
  'credit card',
  'cash',
]

export const MembershipStates: ReadonlyArray<MembershipState> = [
  'active',
  'pending',
  'expired',
]

export const MembershipPeriodStates: ReadonlyArray<MembershipPeriodState> = [
  'planned',
  'issued',
]

export interface Membership {
  id: number
  uuid: string
  name: string
  userId?: number
  user?: number
  recurringPrice: number
  validFrom: string | Date
  validUntil: string | Date
  state: MembershipState
  assignedBy?: string | null
  paymentMethod: string | null
  billingInterval: BillingInterval
  billingPeriods: number
}

export interface MembershipPeriod {
  id: number
  uuid: string
  membership?: number
  membershipId?: number
  start: string | Date
  end: string | Date
  state: MembershipPeriodState
}

export interface CreateMembershipResult {
  membership: Membership
  membershipPeriods: MembershipPeriod[]
}
