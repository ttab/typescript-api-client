import { Api } from '../dist/index'

const api = new Api({ token: process.env.TOKEN || '', timeout: 4000 })

describe('content', () => {

  describe('search', () => {
    it('executes a content search', async () => {
      let res = await api.content.search('text', { q: 'stockholm' })
      expect(res.hits.length).toBeCloseTo(20)
    })

    it('accepts the _all mediaType', async () => {
      let res = await api.content.search('_all', { q: 'stockholm' })
      expect(res.hits.length).toBeCloseTo(20)
    })
  })

  describe('notification', () => {
    it('can be created, listed, and deleted', async () => {
      let res = await api.content.addNotificationMobile('text', {
        q: 'panda',
        title: '__all the pandas__'
      })
      expect(res.title).toEqual('__all the pandas__')
      expect(res.mediaType).toEqual('text')
      expect(res.type).toEqual('mobile')
      expect(res.q).toEqual('panda')

      let found = (await api.content.getNotifications('text')).filter((n) => {
        return n.title === '__all the pandas__'
      })
      expect(found.length).toBeGreaterThanOrEqual(1)

      await found.reduce(async (p, n) => {
        await p
        return api.content.removeNotification(n.mediaType, n.id)
      }, Promise.resolve(''))

      found = (await api.content.getNotifications('text')).filter((n) => {
        return n.title === '__all the pandas__'
      })
      expect(found.length).toEqual(0)
    })
  })

})

describe('user', () => {

  describe('agreement', () => {
    it('can get agreements', async () => {
      await api.user.getAgreements()
    })
  })

  describe('device', () => {
    it('can register and unregister devices', async () => {
      var token = 'abcd-1234-PANDA'
      await api.user.updateDevice(token, {
        type: 'ios-sandbox',
        model: 'iPhone X'
      })
      await api.user.removeDevice(token)
    })
  })

  describe('profile', () => {
    it('can get the user profile', async () => {
      let profile = await api.user.getProfile()
      expect(profile).toHaveProperty('boards')
    })

    it('can get selected properties of the user profile', async () => {
      let profile = await api.user.getProfileByProperty(['boards'])
      expect(profile).toHaveProperty('boards')
    })

    it('can update the user profile', async () => {
      await api.user.updateProfile({ panda: true })
      let profile = await api.user.getProfile()
      expect(profile).toHaveProperty('panda', true)

      await api.user.updateProfile({ panda: false })
      profile = await api.user.getProfile()
      expect(profile).toHaveProperty('panda', false)
    })
  })

})

describe('collection', () => {

  it('can get a list of collections', async () => {
    let colls = await api.collection.getCollections()
    expect(colls).toBeInstanceOf(Array)
  })

})

describe(`anonymous access`, () => {
  const api = new Api({ token: undefined, timeout: 4000 })

  it(`can search the image archive`, async () => {
    const result = await api.content.search('image', { q: 'panda' })
    expect(result.total).toBeGreaterThan(0)
  })

  it(`cannot get user agreement information`, async () => {
    expect(async () => await api.user.getAgreements()).rejects.toThrow('Unauthorized')
  })

  it(`cannot get user profile information`, async () => {
    expect(async () => await api.user.getProfile()).rejects.toThrow('Unauthorized')
  })

  it(`cannot get user collection information`, async () => {
    expect(async () => await api.collection.getCollections()).rejects.toThrow('Unauthorized')
  })

})
