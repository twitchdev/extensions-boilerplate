import Authentication from './Authentication'
import "isomorphic-fetch"

let normalToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NjU5NzMxOTAsIm9wYXF1ZV91c2VyX2lkIjoiVVJpZ0FCQzEyIiwiY2hhbm5lbF9pZCI6ImRlbW9fY2hhbm5lbCIsInJvbGUiOiJ2aWV3ZXIiLCJwdWJzdWJfcGVybXMiOnsibGlzdGVuIjpbImJyb2FkY2FzdCIsImdsb2JhbCJdLCJzZW5kIjpbImJyb2FkY2FzdCJdfSwidXNlcl9pZCI6Inh4eHh4eHh4eCIsImlhdCI6MTUzNDQzNzE5MH0.O2gmsiVIUegWVMwS_mbRU1SF6cdBmHJ5E7JLmsV9AcY'
let modToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NjU5NzMxOTAsIm9wYXF1ZV91c2VyX2lkIjoiVVJpZ0FCQzEyIiwiY2hhbm5lbF9pZCI6ImRlbW9fY2hhbm5lbCIsInJvbGUiOiJicm9hZGNhc3RlciIsInB1YnN1Yl9wZXJtcyI6eyJsaXN0ZW4iOlsiYnJvYWRjYXN0IiwiZ2xvYmFsIl0sInNlbmQiOlsiYnJvYWRjYXN0Il19LCJ1c2VyX2lkIjoieHh4eHh4eHh4IiwiaWF0IjoxNTM0NDM3MTkwfQ.KhwwsrhcsPanRyaPL6dO2knTD0JMXcP38oVqDgjt5Mk'

let auth = new Authentication()

test('able to create new Authenciation instance', ()=>{
    expect(auth).toBeDefined()
})

test('able to set a token', ()=>{
    auth.setToken(normalToken,'U12345678')
    expect(auth.isAuthenticated()).toEqual(true)    
})


describe('makeCall tests', ()=>{
    test('able to call a test URL', async ()=>{
        let response = await auth.makeCall('https://twitch.tv/')
        expect(response.status).toEqual(200)
    })
    
    test('rejects when no credentials', ()=>{
        auth.setToken('','')
        return expect(auth.makeCall('https://twitch.tv/')).rejects.toEqual('Unauthorized')
    })

    test('rejects on invalid response',()=>{
        auth.setToken('abc123','U12345678')
        return expect(auth.makeCall('htts://api')).rejects.toBeDefined()
    })

    test('rejecsts on bad credentials',async ()=>{
        return expect(auth.makeCall('https://google.com')).rejects.toBeDefined()
    })
})

describe('moderator tests', ()=>{
    test('returns valid mod status',()=>{
        auth.setToken(modToken,'ABC123')
        expect(auth.isModerator()).toEqual(true)

        auth.setToken(normalToken,'ABC123')
        expect(auth.isModerator()).toEqual(false)
    })
})