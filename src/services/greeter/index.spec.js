
const greeter = require('.')

describe('greeter.Service', () => {
    it('should give valid object on instantiation', async () => {
        const svc = greeter.init({
            name: 'simeone',
        })
        expect(svc).not.toBeNull()
    })

    const svc = greeter.init({
        name: 'simeone',
    })

    describe('.sayHello()', () => {
        it('should return correct value', async () => {
            // act
            const result = await svc.sayHello()

            // assert
            expect(result).toBe('hello simeone')
        })
    })

})