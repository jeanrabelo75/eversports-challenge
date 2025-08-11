import data from '../../data/membership-periods.json'
import { MembershipPeriod } from '../domain/types'

const membershipPeriods = data as unknown as MembershipPeriod[]

export const MembershipPeriodRepository = {
  findByMembershipById(id: number): MembershipPeriod[] {
    return membershipPeriods.filter((p: any) => p.membershipId === id)
  },
}
