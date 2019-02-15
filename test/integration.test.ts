import { Api } from '../api'
import { setTimeout } from 'timers';

let api = new Api({ token: process.env.TOKEN || '' })

describe('content', () => {

  describe('search', () => {
    it('executes a content search', () => {
      return api.content.search('text', { q: 'stockholm' })
        .then((res) => {
          expect(res.hits.length).toBeCloseTo(20)
        })
    })

    it('accepts the _all mediaType', () => {
      return api.content.search('_all', { q: 'stockholm' })
        .then((res) => {
          expect(res.hits.length).toBeCloseTo(20)
        })
    })
  })

  describe('notification', () => {
    it('can be created, listed, and deleted', () => {
      return api.content.addNotificationMobile('text', {
        q: 'panda',
        title: '__all the pandas__'
      }).then((res) => {
        expect(res.title).toEqual('__all the pandas__')
        expect(res.mediaType).toEqual('text')
        expect(res.type).toEqual('mobile')
        expect(res.q).toEqual('panda')
      }).then(() => {
        return api.content.notification('text')
          .then((res) => {
            return res.filter((n) => {
              return n.title === '__all the pandas__'
            })
          })
      }).then((found) => {
        expect(found.length).toBeGreaterThanOrEqual(1)
        return found.reduce((p, n) => {
          return p.then(() => {
            return api.content.removeNotification(n.mediaType, n.id)
          })
        }, Promise.resolve(''))
      }).then(() => {
        return api.content.notification('text')
          .then((res) => {
            return res.filter((n) => {
              return n.title === '__all the pandas__'
            })
          })
      }).then((found) => {
        expect(found.length).toEqual(0)
      })
    })
  })

})

describe('user', () => {

  describe('agreement', () => {
    it('can get agreements', () => {
      return api.user.agreement()
    })
  })

  describe('device', () => {
    it('can register and unregister devices', () => {
      var token = 'abcd-1234-PANDA'
      return api.user.updateDevice(token, {
        type: 'ios-sandbox',
        model: 'iPhone X'
      }).then(res => {
        return api.user.removeDevice(token)
      })
    })
  })

  describe('profile', () => {
    it('can get the user profile', () => {
      return api.user.profile().then(profile => {
        expect(profile).toHaveProperty('user')
      })
    })

    it('can get selected properties of the user profile', () => {
      return api.user.profileByProperty(['user']).then(profile => {
        expect(profile).toHaveProperty('user')
      })
    })

    it('can update the user profile', () => {
      return api.user.updateProfile({ panda: true })
        .then(() => {
          return api.user.profile()
        }).then(profile => {
          expect(profile).toHaveProperty('panda', true)
        })
        .then(() => {
          return api.user.updateProfile({ panda: false })
        })
        .then(() => {
          return api.user.profile()
        }).then(profile => {
          expect(profile).toHaveProperty('panda', false)
        })
    })
  })

})
