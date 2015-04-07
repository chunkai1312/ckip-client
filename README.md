#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> CKIP Client for Node.js


## Install

```sh
$ npm install --save ckip-client
```


## Usage

```js
var CKIPClient = require('ckip-client');

var ckipClient = new CKIPClient(serverIP, serverPort, your_username, your_password);

ckipClient.request('中研院斷詞系統客戶端程式', function (err, response) {

  if (err) {
    console.log(err);
  }

  ckipClient.getSentences(response, function (err, setences) {
    if (err) {
      console.log(err);
    }
    console.dir(setences);
  });

  ckipClient.getTerms(response, function (err, terms) {
    if (err) {
      console.log(err);
    }
    console.dir(terms);
  });

});
```


## License

MIT © [Chun-Kai Wang]()


[npm-image]: https://badge.fury.io/js/ckip-client.svg
[npm-url]: https://npmjs.org/package/ckip-client
[travis-image]: https://travis-ci.org/chunkai1312/ckip-client.svg?branch=master
[travis-url]: https://travis-ci.org/chunkai1312/ckip-client
[daviddm-image]: https://david-dm.org/chunkai1312/ckip-client.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/chunkai1312/ckip-client
