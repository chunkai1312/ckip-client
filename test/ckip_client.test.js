'use strict'

var fs = require('fs')
var path = require('path')
var Promise = require('bluebird')
var expect = require('chai').expect
var sinon = require('sinon')
var ckip = require('../')('0.0.0.0', 0, 'username', 'password')

var mockResponse = fs.readFileSync(path.resolve(__dirname, 'mock.xml'), 'utf-8')

describe('CKIPClient', function () {
  var sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('#request()', function () {
    var text = '台新金控12月3日將召開股東臨時會進行董監改選。'

    it('should get response without error if initial parameters are valid', function (done) {
      sandbox.stub(ckip, 'request').withArgs(text).yields(null, mockResponse)

      ckip.request(text, function (err, res) {
        expect(err).to.not.exist
        expect(res).to.equal(mockResponse)
        done()
      })
    })

    it('should return promise with response', function () {
      sandbox.stub(ckip, 'request').withArgs(text).returns(Promise.resolve(mockResponse))

      return ckip.request(text)
        .then(function (res) {
          expect(res).to.equal(mockResponse)
        })
    })
  })

  describe('#getSentences()', function () {
    var expected = ['　台新(N)　金控(N)　12月(N)　3日(N)　將(ADV)　召開(Vt)　股東(N)　臨時會(N)　進行(Vt)　董監(N)　改選(Nv)　。(PERIODCATEGORY)']

    it('should get setences without error', function (done) {
      ckip.getSentences(mockResponse, function (err, setences) {
        expect(err).to.not.exist
        expect(setences).to.exist
        expect(setences).to.be.an('array')
        expect(setences).to.be.eql(expected)
        done()
      })
    })

    it('should return promise with setences', function () {
      return ckip.getSentences(mockResponse).then(function (setences) {
        expect(setences).to.exist
        expect(setences).to.be.an('array')
        expect(setences).to.be.eql(expected)
      })
    })
  })

  describe('#getTerms()', function () {
    var expected = [
      { term: '台新', tag: 'N' },
      { term: '金控', tag: 'N' },
      { term: '12月', tag: 'N' },
      { term: '3日', tag: 'N' },
      { term: '將', tag: 'ADV' },
      { term: '召開', tag: 'Vt' },
      { term: '股東', tag: 'N' },
      { term: '臨時會', tag: 'N' },
      { term: '進行', tag: 'Vt' },
      { term: '董監', tag: 'N' },
      { term: '改選', tag: 'Nv' },
      { term: '。', tag: 'PERIODCATEGORY' }
    ]

    it('should get terms without error', function (done) {
      ckip.getTerms(mockResponse, function (err, terms) {
        expect(err).to.not.exist
        expect(terms).to.exist
        expect(terms).to.be.an('array')
        expect(terms).to.be.eql(expected)
        done()
      })
    })

    it('should return promise with terms', function () {
      return ckip.getTerms(mockResponse).then(function (terms) {
        expect(terms).to.exist
        expect(terms).to.be.an('array')
        expect(terms).to.be.eql(expected)
      })
    })
  })
})
