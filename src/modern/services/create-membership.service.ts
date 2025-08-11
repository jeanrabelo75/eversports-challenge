import { CreateMembershipDto } from '../dtos/create-membership.dto'
import {
  CreateMembershipResult,
  Membership,
  MembershipPeriod,
} from '../domain/types'
import { validateCreateMembership } from '../validators/membership.validation'
import { computeValidUntil, generatePeriodRanges } from '../domain/periods'
import { computeState } from '../domain/state'
import { MembershipRepository } from '../repositories/membership.repository'
import { v4 as uuidv4 } from 'uuid'

const STATIC_USER_ID = 2000

export class CreateMembershipService {
  static execute(input: CreateMembershipDto): CreateMembershipResult {
    validateCreateMembership(input)

    const validFrom = input.validFrom ? new Date(input.validFrom) : new Date()
    const validUntil = computeValidUntil(
      validFrom,
      input.billingInterval,
      input.billingPeriods,
    )

    const state = computeState(validFrom, validUntil)

    const newMembership: Membership = {
      id: MembershipRepository.nextId(),
      uuid: uuidv4(),
      name: input.name!,
      state,
      validFrom,
      validUntil,
      user: STATIC_USER_ID,
      paymentMethod: (input.paymentMethod ?? null) as any,
      recurringPrice: input.recurringPrice!,
      billingPeriods: input.billingPeriods,
      billingInterval: input.billingInterval,
    }

    MembershipRepository.add(newMembership)

    const ranges = generatePeriodRanges(
      validFrom,
      input.billingInterval,
      input.billingPeriods,
    )

    const membershipPeriods: MembershipPeriod[] = ranges.map((r, idx) => ({
      id: idx + 1,
      uuid: uuidv4(),
      membershipId: newMembership.id,
      start: r.start,
      end: r.end,
      state: 'planned',
    }))

    return { membership: newMembership, membershipPeriods }
  }
}
