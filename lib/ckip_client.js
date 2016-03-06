var net = require('net');
var Promise = require('bluebird');
var builder = require('xmlbuilder');
var iconv = require('iconv-lite');
var parseString = require('xml2js').parseString;

/**
 * CKIPClient constructor
 * 
 * @class CKIPClient
 * @constructor
 * @param {String} serverIP - server ip
 * @param {Number} serverPort - server port
 * @param {String} username - your username
 * @param {String} password - your password
 */
var CKIPClient = function (serverIP, serverPort, username, password) {
  if (!(this instanceof CKIPClient)) {
    return new CKIPClient(serverIP, serverPort, username, password);
  }
  this.serverIP = serverIP;
  this.serverPort = serverPort;
  this.username = username;
  this.password = password;
};

/**
 * Send a request to CKIP server
 * 
 * @method request
 * @param  {String}   text - the text to tokenize
 * @param  {Function} callback - callback function for when request is complete
 * @return {Promise}  the response of the request
 */
CKIPClient.prototype.request = function (text, callback) {
  callback = callback || function () { };

  return new Promise(function (resolve, reject) {
    var xml = builder.create('wordsegmentation').att('version', '0.1')
      .ele('option', { 'showcategory': '1' }).up()
      .ele('authentication', { 'username': this.username, 'password': this.password }).up()
      .ele('text', text)
      .end({ pretty: true });

    xml = iconv.encode(xml, 'big5');  // encode to big5

    var client = net.connect({ port: this.serverPort, host: this.serverIP }, function () {
      client.write(xml);
    });

    client.on('data', function (data) {
      var xml = iconv.decode(data, "big5"); // decode from big5
      client.end();

      // parse xml string to check result
      parseString(xml, function (err, result) {
        if (err) {
          reject(err);
          return callback(err);
        }

        var processStatus = result.wordsegmentation.processstatus[0]._;
        var statusCode = result.wordsegmentation.processstatus[0].$.code;
        if (statusCode != 0) {  // 0 = success
          reject(new Error(processStatus));
          return callback(new Error(processStatus));
        }
        resolve(xml);
        return callback(null, xml);
      });
    });

    client.on('error', function (err) {
      console.log(err);
      resolve(err);
      return callback(err);
    });

  }.bind(this));
};

/**
 * Get sentences from the server response
 * 
 * @method getSentences
 * @param  {String}   data - Read data from the server response
 * @param  {Function} callback - callback function for when parsing is complete
 * @return {Promise}  sentences from the parsing result
 */
CKIPClient.prototype.getSentences = function (data, callback) {
  callback = callback || function () { };

  return new Promise(function (resolve, reject) {
    parseString(data, function (err, result) {
      if (err) {
        reject(err);
        return callback(err);
      }
      var sentences = result.wordsegmentation.result[0].sentence; // array
      resolve(sentences);
      return callback(null, sentences);
    });
  });
};

/**
 * Get terms from the server response
 * 
 * @method getTerms
 * @param  {String}   data - Read data from the server response
 * @param  {Function} callback - callback function for when parsing is complete
 * @return {Promise}  the terms from the parsing result
 */
CKIPClient.prototype.getTerms = function (data, callback) {
  callback = callback || function () { };

  return new Promise(function (resolve, reject) {
    this.getSentences(data, function (err, sentences) {
      var terms = [];

      for (var index in sentences) {
        var tokens = sentences[index].split('　');

        for (var index in tokens) {
          if (tokens[index]) {
            var segments = tokens[index].match(/(\S*)\((\S*)\)/);
            terms.push({ term: segments[1], tag: segments[2] });
          }
        }
      }
      resolve(terms);
      return callback(null, terms);
    });
  }.bind(this));
};

module.exports = CKIPClient;