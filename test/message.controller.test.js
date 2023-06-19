const { sendMessage } = require('../src/controller/message.controller');

describe('sendMessage', () => {

    let mockClient
    let mockMessage
    let req, res, next

    beforeEach(() => {
        mockClient = {}
        mockMessage = jest.fn().mockRejectedValue()

        req = {
            body: {
                body: '1234',
                to: '+573155643435'
            }
        }

        res = {
            status: jest.fn().mockReturnThis(200),
            json: jest.fn()
        }

        next = jest.fn()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })


    test("should send a message successfully", async () => {
        // Crea objetos mock para req, res y next      
        mockClient = {
            messages: {
                create: jest.fn()
            }
        }

        jest.mock("twilio", () => () => mockClient)

        // Ejecuta el middleware con los objetos mock
        await sendMessage(req, res, next)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ message: "Se envió el mensaje correctamente", })
        expect(next).not.toHaveBeenCalled()
    })


    test('Should call next with an error when Twilio credentials are invalid', async () => {
        // Mocking Twilio client create method to throw an error
        const mockError = {
            code: 20003,
            status: 401,
            message: 'Invalid credentials'
        }  
        
        mockMessage = jest.fn().mockRejectedValue(mockError)
        mockClient = {
            messages: {
                create: mockMessage
            }
        }

        jest.mock("twilio", () => () => mockClient)

        await sendMessage(req, res, next)

        expect(next).toHaveBeenCalledWith(mockError)
    })


    test('Should call next with an error when an unexpected error occurs', async () => {
        // Mocking Twilio client create method to throw an error
        const mockError = new Error('Some error')
        mockMessage = jest.fn().mockRejectedValue(mockError)
        mockClient = {
            messages: {
                create: mockMessage
            }
        }

        jest.mock("twilio", () => () => mockClient)

        await sendMessage(req, res, next)
        expect(next).toHaveBeenCalledWith(mockError)
    })
})
