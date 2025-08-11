import { ListMembershipsService } from '../../src/modern/services/list-memberships.service'
import memberships from '../../src/data/memberships.json'

describe('ListMembershipsService', () => {
  it('returns one row per membership in the seed data', () => {
    const rows = ListMembershipsService.execute()
    expect(rows).toHaveLength((memberships as any[]).length)
  })

  it('for seed data, periods are empty due to legacy membershipId filter', () => {
    const rows = ListMembershipsService.execute()
    expect(rows.every(r => Array.isArray(r.periods) && r.periods.length === 0)).toBe(true)
  })

  it('row shape contains membership and periods', () => {
    const rows = ListMembershipsService.execute()
    for (const row of rows) {
      expect(Object.keys(row)).toEqual(['membership', 'periods'])
      expect(row.membership).toHaveProperty('id')
      expect(Array.isArray(row.periods)).toBe(true)
    }
  })
})
