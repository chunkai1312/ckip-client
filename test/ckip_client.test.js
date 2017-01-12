'use strict'

var fs = require('fs')
var path = require('path')
var Promise = require('bluebird')
var iconv = require('iconv-lite')
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

    it('should get response without error', function (done) {
      sandbox.stub(ckip, 'connect').returns(Promise.resolve(iconv.encode(mockResponse, 'big5')))

      ckip.request(text, function (err, res) {
        expect(err).to.not.exist
        expect(res).to.equal(mockResponse)
        done()
      })
    })

    it('should return promise with response', function () {
      sandbox.stub(ckip, 'connect').returns(Promise.resolve(iconv.encode(mockResponse, 'big5')))

      return ckip.request(text)
        .then(function (res) {
          expect(res).to.equal(mockResponse)
        })
    })

    it('should exist error if cannot connect to CKIP server', function (done) {
      sandbox.stub(ckip, 'connect').returns(Promise.reject(new Error()))

      ckip.request(text, function (err, res) {
        expect(err).to.exist
        expect(err).to.be.an('error')
        expect(res).to.not.exist
        done()
      })
    })

    it('should throw error if cannot connect to CKIP server', function () {
      sandbox.stub(ckip, 'connect').returns(Promise.reject(new Error()))

      return ckip.request(text)
        .catch(function (err) {
          expect(err).to.be.an('error')
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

    it('should exist error if invalid xml formatted format', function () {
      ckip.getSentences('invalid xml', function (err, setences) {
        expect(err).to.exist
        expect(err).to.be.an('error')
        expect(setences).to.not.exist
      })
    })

    it('should throw error if invalid xml formatted format', function () {
      return ckip.getSentences('invalid xml')
        .catch(function (err) {
          expect(err).to.be.an('error')
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

    it('should exist error if invalid xml formatted format', function () {
      ckip.getTerms('invalid xml', function (err, terms) {
        expect(err).to.exist
        expect(err).to.be.an('error')
        expect(terms).to.not.exist
      })
    })

    it('should throw error if invalid xml formatted format', function () {
      return ckip.getTerms('invalid xml')
        .catch(function (err) {
          expect(err).to.be.an('error')
        })
    })
  })
})
