var net = require('net'),
  builder = require('xmlbuilder'),
  iconv = require('iconv-lite'),
  parseString = require('xml2js').parseString;

/**
 * CKIPClient constructor
 * @constructor
 * @param {String} serverIP   Server ip
 * @param {String} serverPort Server port
 * @param {String} username   Your username
 * @param {String} password   Your password
 */
var CKIPClient = function (serverIP, serverPort, username, password) {
  this.serverIP = serverIP;
  this.serverPort = serverPort;
  this.username = username;
  this.password = password;
};

/**
 * request
 * @param  {String}   text     Text to tokenize
 * @return {Function} callback [function (err, response)]
 */
CKIPClient.prototype.request = function (text, callback) {
  var xml = builder.create('wordsegmentation').att('version', '0.1')
    .ele('option', {'showcategory': '1'}).up()
    .ele('authentication', {'username': this.username, 'password': this.password}).up()
    .ele('text', text)
    .end({ pretty: true});
  
  xml = iconv.encode(xml, 'big5');  // encode to big5

  var client = net.connect({port: this.serverPort, host: this.serverIP }, function () { 
      console.log('connected to server');
      client.write(xml);
    });

  client.on('data', function (data) {
    var xml = iconv.decode(data, "big5"); // decode from big5
    client.end();

    // parse xml string to check result
    parseString(xml, function (err, result) {
      if (err) return callback(err);

      var processStatus = result.wordsegmentation.processstatus[0]._;
      var statusCode = result.wordsegmentation.processstatus[0].$.code;
      if (statusCode != 0) {  // 0 = success
        return callback(new Error(processStatus));
      }
      return callback(null, xml);
    });
  });

  client.on('end', function () {
    console.log('disconnected from server');
  });

  client.on('error', function (err) {
    return callback(err);
  });
};

/**
 * getSentences
 * @param  {String}   data     Read data from server response
 * @return {Function} callback [function (err, sentences)]
 */
CKIPClient.prototype.getSentences = function (data, callback) {
  parseString(data, function (err, result) {
    if (err) return callback(err);

    var sentences = result.wordsegmentation.result[0].sentence; // array
    return callback(null, sentences);
  });
};

/**
 * getTerms
 * @param  {String}   data     Read data from server response
 * @return {Function} callback [function (err, terms)]
 */
CKIPClient.prototype.getTerms = function (data, callback) {
  parseString(data, function (err, result) {
    if (err) return callback(err);

    var sentences = result.wordsegmentation.result[0].sentence,
      terms = [];

    for (var index in sentences) {
      var tokens = sentences[index].split('　');

      for (var index in tokens) {
        if (tokens[index] != '') {
          var segments = tokens[index].match(/(\S*)\((\S*)\)/);
          terms.push({term: segments[1], tag: segments[2]});
        }
      }
    }

    return callback(null, terms);
  });
};

module.exports = CKIPClient;