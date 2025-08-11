import { computeState } from '../../src/modern/domain/state'

describe('domain/state', () => {
  const NOW = new Date(2023, 5, 15)

  it('returns active when now is between validFrom and validUntil (inclusive)', () => {
    const from = new Date(2023, 0, 1)
    const until = new Date(2023, 11, 31)
    expect(computeState(from, until, NOW)).toBe('active')
  })

  it('returns pending when validFrom is in the future', () => {
    const from = new Date(2024, 0, 1)
    const until = new Date(2024, 11, 31)
    expect(computeState(from, until, NOW)).toBe('pending')
  })

  it('returns expired when validUntil is in the past', () => {
    const from = new Date(2022, 0, 1)
    const until = new Date(2022, 11, 31)
    expect(computeState(from, until, NOW)).toBe('expired')
  })
})
