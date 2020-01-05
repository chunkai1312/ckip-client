'use strict'

const fs = require('fs')
const path = require('path')
const expect = require('chai').expect
const td = require('testdouble')
const EventEmitter = require('events').EventEmitter
const net = td.replace('net')
const CKIPClient = require('../lib/ckip_client')

describe('CKIPClient', () => {
  let client

  beforeEach(() => {
    client = new EventEmitter()
    client.connect = td.func()
    client.write = td.func()
    client.end = td.func()
    client.destroy = td.func()

    td.when(new net.Socket()).thenReturn(client)
    td.when(client.end()).thenDo(() => client.removeAllListeners())
    td.when(client.destroy()).thenDo(() => client.removeAllListeners())
  })

  afterEach(() => {
    td.reset()
  })

  describe('#constructor()', () => {
    it('should be instantiated', () => {
      const ckip = new CKIPClient({
        host: '0.0.0.0',
        port: 0,
        username: 'username',
        password: 'password'
      })
      expect(ckip).to.be.an.instanceof(CKIPClient)
    })
  })

  describe('#segment()', () => {
    it('should segment', async () => {
      const anything = td.matchers.anything()
      const data = fs.readFileSync(path.resolve(__dirname, './fixtures/success.xml'))
      td.when(client.connect(anything, anything)).thenDo(() => client.emit('connect'))
      td.when(client.write(anything)).thenDo(() => client.emit('data', data))

      const ckip = new CKIPClient({
        host: '0.0.0.0',
        port: 0,
        username: 'username',
        password: 'password'
      })
      const sentences = await ckip.segment('台新金控12月3日將召開股東臨時會進行董監改選。')
      const words = sentences[0]
      expect(sentences).to.have.length(1)
      expect(words).to.have.members(['台新', '金控', '12月', '3日', '將', '召開', '股東', '臨時會', '進行', '董監', '改選', '。'])
    })

    it('should segment with POS tagging', async () => {
      const anything = td.matchers.anything()
      const data = fs.readFileSync(path.resolve(__dirname, './fixtures/success.xml'))
      td.when(client.connect(anything, anything)).thenDo(() => client.emit('connect'))
      td.when(client.write(anything)).thenDo(() => client.emit('data', data))

      const ckip = new CKIPClient({
        host: '0.0.0.0',
        port: 0,
        username: 'username',
        password: 'password'
      })
      const sentences = await ckip.segment('台新金控12月3日將召開股東臨時會進行董監改選。', { tag: true })
      const words = sentences[0]
      expect(sentences).to.have.length(1)
      expect(words).to.have.deep.members([
        { word: '台新', tag: 'N' },
        { word: '金控', tag: 'N' },
        { word: '12月', tag: 'N' },
        { word: '3日', tag: 'N' },
        { word: '將', tag: 'ADV' },
        { word: '召開', tag: 'Vt' },
        { word: '股東', tag: 'N' },
        { word: '臨時會', tag: 'N' },
        { word: '進行', tag: 'Vt' },
        { word: '董監', tag: 'N' },
        { word: '改選', tag: 'Nv' },
        { word: '。', tag: 'PERIODCATEGORY' }
      ])
    })

    it('should throw error if authentication failed', async () => {
      const anything = td.matchers.anything()
      const data = fs.readFileSync(path.resolve(__dirname, './fixtures/error.xml'))
      td.when(client.connect(anything, anything)).thenDo(() => client.emit('connect'))
      td.when(client.write(anything)).thenDo(() => client.emit('data', data))

      try {
        const ckip = new CKIPClient({
          host: '0.0.0.0',
          port: 0,
          username: 'username',
          password: 'password'
        })
        await ckip.segment('台新金控12月3日將召開股東臨時會進行董監改選。')
      } catch (err) {
        expect(err).to.be.an('error')
      }
    })

    it('should throw error if cannot connect to CKIP server', async () => {
      const anything = td.matchers.anything()
      td.when(client.connect(anything, anything)).thenDo(() => client.emit('error', new Error()))

      try {
        const ckip = new CKIPClient({
          host: '0.0.0.0',
          port: 0,
          username: 'username',
          password: 'password'
        })
        await ckip.segment('台新金控12月3日將召開股東臨時會進行董監改選。')
      } catch (err) {
        expect(err).to.be.an('error')
      }
    })
  })
})

