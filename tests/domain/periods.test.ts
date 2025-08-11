import { computeValidUntil, generatePeriodRanges } from '../../src/modern/domain/periods'

describe('domain/periods', () => {
  describe('computeValidUntil', () => {
    it('adds months for monthly interval', () => {
      const start = new Date(2023, 0, 1)
      const out = computeValidUntil(start, 'monthly', 6)
      expect(out.getFullYear()).toBe(2023)
      expect(out.getMonth()).toBe(6)
      expect(out.getDate()).toBe(1)
    })

    it('adds years (in months) for yearly interval', () => {
      const start = new Date(2023, 0, 1)
      const out = computeValidUntil(start, 'yearly', 2)
      expect(out.getFullYear()).toBe(2025)
      expect(out.getMonth()).toBe(0)
      expect(out.getDate()).toBe(1)
    })

    it('adds weeks (in days) for weekly interval', () => {
      const start = new Date(2023, 0, 1)
      const out = computeValidUntil(start, 'weekly', 8)
      expect(out.getFullYear()).toBe(2023)
      expect(out.getMonth()).toBe(1)
      expect(out.getDate()).toBe(26)
    })
  })

  describe('generatePeriodRanges', () => {
    it('generates contiguous monthly ranges', () => {
      const start = new Date(2023, 0, 1)
      const ranges = generatePeriodRanges(start, 'monthly', 3)

      expect(ranges).toHaveLength(3)

      expect(ranges[0].start.getFullYear()).toBe(2023)
      expect(ranges[0].start.getMonth()).toBe(0)
      expect(ranges[0].start.getDate()).toBe(1)
      expect(ranges[0].end.getMonth()).toBe(1)
      expect(ranges[0].end.getDate()).toBe(1)

      expect(ranges[1].start.getTime()).toBe(ranges[0].end.getTime())
      expect(ranges[1].end.getMonth()).toBe(2)
      expect(ranges[1].end.getDate()).toBe(1)

      expect(ranges[2].start.getTime()).toBe(ranges[1].end.getTime())
      expect(ranges[2].end.getMonth()).toBe(3)
      expect(ranges[2].end.getDate()).toBe(1)
    })

    it('generates yearly ranges with 12-month steps', () => {
      const start = new Date(2023, 0, 1)
      const ranges = generatePeriodRanges(start, 'yearly', 2)

      expect(ranges).toHaveLength(2)

      expect(ranges[0].end.getFullYear()).toBe(2024)
      expect(ranges[0].end.getMonth()).toBe(0)
      expect(ranges[0].end.getDate()).toBe(1)

      expect(ranges[1].start.getTime()).toBe(ranges[0].end.getTime())
      expect(ranges[1].end.getFullYear()).toBe(2025)
      expect(ranges[1].end.getMonth()).toBe(0)
      expect(ranges[1].end.getDate()).toBe(1)
    })

    it('generates weekly ranges with 7-day steps', () => {
      const start = new Date(2023, 0, 1)
      const ranges = generatePeriodRanges(start, 'weekly', 2)

      expect(ranges).toHaveLength(2)

      expect(ranges[0].end.getFullYear()).toBe(2023)
      expect(ranges[0].end.getMonth()).toBe(0)
      expect(ranges[0].end.getDate()).toBe(8)

      expect(ranges[1].start.getTime()).toBe(ranges[0].end.getTime())
      expect(ranges[1].end.getFullYear()).toBe(2023)
      expect(ranges[1].end.getMonth()).toBe(0)
      expect(ranges[1].end.getDate()).toBe(15)
    })
  })
})
