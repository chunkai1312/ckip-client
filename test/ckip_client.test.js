'use strict'

var expect = require('chai').expect
var ckip = require('../')('0.0.0.0', 0, 'username', 'password')

describe('CKIPClient', function () {
  var error, response

  describe('#request()', function () {
    var promise

    before(function (done) {
      promise = ckip.request('台新金控12月3日將召開股東臨時會進行董監改選。', function (err, res) {
        error = err
        response = res
        done()
      })
    })

    it('should get response without error if initial parameters are valid', function (done) {
      if (error) return done()
      expect(response).to.exist
      done()
    })

    it('should return promise with response', function (done) {
      if (error) return done()
      promise.then(function (res) {
        expect(res).to.exist
        done()
      })
    })
  })

  describe('#getSentences()', function () {
    var promise

    it('should get setences without error', function (done) {
      if (error) return done()
      promise = ckip.getSentences(response, function (err, setences) {
        expect(err).to.not.exist
        expect(setences).to.exist
        expect(setences).to.be.instanceof(Array)
        done()
      })
    })

    it('should return promise with setences', function (done) {
      if (error) return done()
      promise.then(function (setences) {
        expect(setences).to.exist
        expect(setences).to.be.instanceof(Array)
        done()
      })
    })
  })

  describe('#getTerms()', function () {
    var promise

    it('should get terms without error', function (done) {
      if (error) return done()
      promise = ckip.getTerms(response, function (err, terms) {
        expect(err).to.not.exist
        expect(terms).to.exist
        expect(terms).to.be.instanceof(Array)
        done()
      })
    })

    it('should return promise with terms', function (done) {
      if (error) return done()
      promise.then(function (terms) {
        expect(terms).to.exist
        expect(terms).to.be.instanceof(Array)
        done()
      })
    })
  })
})
