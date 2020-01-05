'use strict'

const fs = require('fs')
const path = require('path')
const expect = require('chai').expect
const CKIPResponse = require('../lib/ckip_response')

describe('CKIPResponse', () => {
  describe('#constructor()', () => {
    it('should be instantiated', () => {
      const data = fs.readFileSync(path.resolve(__dirname, './fixtures/response_success.xml'))
      const response = new CKIPResponse(data)
      expect(response).to.be.an.instanceof(CKIPResponse)
      expect(response.data).to.be.an.instanceof(Buffer)
      expect(response.data.toString()).to.equal(data.toString())
    })
  })

  describe('#segment()', () => {
    it('should segment', async () => {
      const data = fs.readFileSync(path.resolve(__dirname, './fixtures/response_success.xml'))
      const response = new CKIPResponse(data)
      const sentences = await response.segment()
      const words = sentences[0]
      expect(sentences).to.have.length(1)
      expect(words).to.have.members(['台新', '金控', '12月', '3日', '將', '召開', '股東', '臨時會', '進行', '董監', '改選', '。'])
    })

    it('should segment with POS tagging', async () => {
      const data = fs.readFileSync(path.resolve(__dirname, './fixtures/response_success.xml'))
      const response = new CKIPResponse(data)
      const sentences = await response.segment({ tag: true })
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
      const data = fs.readFileSync(path.resolve(__dirname, './fixtures/response_error.xml'))
      const response = new CKIPResponse(data)
      try {
        await response.segment()
      } catch (err) {
        expect(err).to.be.an('error')
      }
    })
  })
})

