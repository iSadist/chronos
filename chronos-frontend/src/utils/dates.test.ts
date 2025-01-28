import { getEndOfMonth, getStartOfMonth, turnDateIntoString } from './dates'

describe('Date Utils', () => {
    describe('getEndOfMonth', () => {
        it('should get end of month for january', () => {
            const date = new Date('2021-01-15')
            const endOfMonth = getEndOfMonth(date)

            expect(endOfMonth.getFullYear()).toEqual(2021)
            expect(endOfMonth.getMonth()).toEqual(0)
            expect(endOfMonth.getDate()).toEqual(31)
        })

        it('should get end of month for february', () => {
            const date = new Date('2021-02-15')
            const endOfMonth = getEndOfMonth(date)

            expect(endOfMonth.getFullYear()).toEqual(2021)
            expect(endOfMonth.getMonth()).toEqual(1)
            expect(endOfMonth.getDate()).toEqual(28)
        })

        it('should return the last day of the month when input is last day', () => {
            const date = new Date('2021-02-28')
            const endOfMonth = getEndOfMonth(date)

            expect(endOfMonth.getFullYear()).toEqual(2021)
            expect(endOfMonth.getMonth()).toEqual(1)
            expect(endOfMonth.getDate()).toEqual(28)
        })

        it('should return the last day of the month when input is first day', () => {
            const date = new Date('2021-02-01')
            const endOfMonth = getEndOfMonth(date)

            expect(endOfMonth.getFullYear()).toEqual(2021)
            expect(endOfMonth.getMonth()).toEqual(1)
            expect(endOfMonth.getDate()).toEqual(28)
        })
    })

    describe('getStartOfMonth', () => {
        it('should get start of month for january', () => {
            const date = new Date('2021-01-15')
            const startOfMonth = getStartOfMonth(date)

            expect(startOfMonth.getFullYear()).toEqual(2021)
            expect(startOfMonth.getMonth()).toEqual(0)
            expect(startOfMonth.getDate()).toEqual(1)
        })

        it('should get start of month for february', () => {
            const date = new Date('2021-02-15')
            const startOfMonth = getStartOfMonth(date)

            expect(startOfMonth.getFullYear()).toEqual(2021)
            expect(startOfMonth.getMonth()).toEqual(1)
            expect(startOfMonth.getDate()).toEqual(1)
        })
    })

    describe('turnDateIntoString', () => {
        it('should turn date into string', () => {
            const date = new Date('2021-01-15')
            const dateString = turnDateIntoString(date)

            expect(dateString).toEqual('2021-01-15')
        })
    })
})