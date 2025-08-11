import { Membership } from './types'

export function computeState(
  validFrom: Date,
  validUntil: Date,
  now = new Date(),
): Membership['state'] {
  let state: Membership['state'] = 'active'
  if (validFrom > now) state = 'pending'
  if (validUntil < now) state = 'expired'
  return state
}
