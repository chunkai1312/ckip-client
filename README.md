# ckip-client

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][codecov-image]][codecov-url]

> CKIP Client for Node.js

## Install

```
$ npm install --save ckip-client
```

## Usage

```js
const CKIPClient = require('ckip-client')

const ckip = new CKIPClient({ host, port, user, pass })

ckip.segment('台新金控12月3日將召開股東臨時會進行董監改選。')
  .then(sentences => console.log(sentences))

// [ [ '台新', '金控', '12月', '3日', '將', '召開', '股東', '臨時會', '進行', '董監', '改選', '。' ] ]
```

### Part-of-speech (POS) tagging

```js
ckip.segment('台新金控12月3日將召開股東臨時會進行董監改選。', { tag: true })
  .then(sentences => console.log(sentences))

// [ [ { word: '台新', tag: 'N' },
//     { word: '金控', tag: 'N' },
//     { word: '12月', tag: 'N' },
//     { word: '3日', tag: 'N' },
//     { word: '將', tag: 'ADV' },
//     { word: '召開', tag: 'Vt' },
//     { word: '股東', tag: 'N' },
//     { word: '臨時會', tag: 'N' },
//     { word: '進行', tag: 'Vt' },
//     { word: '董監', tag: 'N' },
//     { word: '改選', tag: 'Nv' },
//     { word: '。', tag: 'PERIODCATEGORY' } ] ]
```

## Reference

[CKIP中文斷詞系統](http://ckipsvr.iis.sinica.edu.tw)

## License

MIT © [Chun-Kai Wang]()

[npm-image]: https://img.shields.io/npm/v/ckip-client.svg
[npm-url]: https://npmjs.org/package/ckip-client
[travis-image]: https://img.shields.io/travis/chunkai1312/ckip-client.svg
[travis-url]: https://travis-ci.org/chunkai1312/ckip-client
[codecov-image]: https://img.shields.io/codecov/c/github/chunkai1312/ckip-client.svg
[codecov-url]: https://codecov.io/gh/chunkai1312/ckip-client
