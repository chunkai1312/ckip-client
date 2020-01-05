'use strict'

const fs = require('fs')
const path = require('path')
const expect = require('chai').expect
const CKIPRequest = require('../lib/ckip_request')

describe('CKIPRequest', () => {
  describe('#constructor()', () => {
    it('should be instantiated', () => {
      const data = fs.readFileSync(path.resolve(__dirname, './fixtures/request.xml'))
      const authentication = { username: 'username', password: 'password' }
      const text = '台新金控12月3日將召開股東臨時會進行董監改選。'
      const request = new CKIPRequest({ authentication, text })
      expect(request).to.be.an.instanceof(CKIPRequest)
      expect(request.data).to.be.an.instanceof(Buffer)
      expect(request.data.toString()).to.equal(data.toString())
    })
  })
})
