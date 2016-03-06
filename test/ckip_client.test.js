'use strict';

var expect = require('chai').expect;
var ckip = require('../')('0.0.0.0', 0, 'your_username', 'your_password');

describe('CKIPClient', function () {
  var error, response;
  this.timeout(10000);

  before(function (done) {
    ckip.request('台新金控12月3日將召開股東臨時會進行董監改選。', function (err, res) {
      error = err;
      response = res;
      done();
    });
  });

  describe('#request()', function () {
    it('should return response without error if initial parameters are valid', function (done) {      
      if (error) return done();
      expect(response).to.exist;
      done();
    });
  });
  
  describe('#getSentences()', function () {
    it('should return setences without err', function (done) {
      if (error) return done();
      ckip.getSentences(response, function (err, setences) {
        expect(err).to.not.exist;
        expect(setences).to.exist;
        done();
      });
    });
  });

  describe('#getTerms()', function () {
    it('should return terms without err', function (done) {
      if (error) return done();
      ckip.getTerms(response, function (err, terms) {
        expect(err).to.not.exist;
        expect(terms).to.exist;
        done();
      });
    });
  });

});