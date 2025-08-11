import data from '../../data/memberships.json'
import { Membership } from '../domain/types'

const memberships = data as unknown as Membership[]

export const MembershipRepository = {
  getAll(): Membership[] {
    return memberships
  },
  nextId(): number {
    return memberships.length + 1
  },
  add(m: Membership): void {
    memberships.push(m)
  },
}
