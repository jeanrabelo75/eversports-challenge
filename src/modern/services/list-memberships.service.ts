import { MembershipRepository } from '../repositories/membership.repository'
import { MembershipPeriodRepository } from '../repositories/membership-period.repository'
import { Membership, MembershipPeriod } from '../domain/types'

export class ListMembershipsService {
  static execute(): Array<{
    membership: Membership
    periods: MembershipPeriod[]
  }> {
    const rows: Array<{ membership: Membership; periods: MembershipPeriod[] }> =
      []

    for (const membership of MembershipRepository.getAll()) {
      const periods = MembershipPeriodRepository.findByMembershipById(
        (membership as any).id,
      )
      rows.push({ membership, periods })
    }

    return rows
  }
}
