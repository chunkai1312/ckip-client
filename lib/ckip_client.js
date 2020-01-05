'use strict'

const net = require('net')
const CKIPRequest = require('./ckip_request')
const CKIPResponse = require('./ckip_response')

class CKIPClient {

  /**
   * Create a CKIPClient.
   *
   * @param {Object} options - The optional settings.
   * @param {string} options.host - The host of CKIP server.
   * @param {number} options.port - The port of CKIP server.
   * @param {string} options.user - The username for authentication.
   * @param {string} options.pass - The password for authentication.
   */
  constructor (options) {
    options = Object.assign({}, options)
    this.host = options.host
    this.port = options.port
    this.user = options.user
    this.pass = options.pass
  }

  /**
   * Send request data to CKIP server.
   *
   * @param {CKIPRequest} request - The request data for word segmentation.
   * @return {Promise} The promise with response data from the server.
   */
  send (request) {
    return new Promise((resolve, reject) => {
      const client = new net.Socket()

      client.on('connect', () => {
        client.write(request.data)
      })

      client.on('data', data => {
        resolve(new CKIPResponse(data))
        client.end()
      })

      client.on('error', err => {
        reject(err)
        client.destroy(err)
      })

      client.connect(this.port, this.host)
    })
  }

  /**
   * Segment the text to sentences and words.
   *
   * @param {string} text - The text to segment.
   * @param {Object} options - The optional settings.
   * @param {boolean} options.tag - Part-of-speech tagging (POS tagging), defualts to false.
   * @return {Promise} The promise with segmented sentences and words.
   */
  segment (text, options = { tag: false }) {
    const authentication = { username: this.user, password: this.pass }
    const request = new CKIPRequest({ authentication, text })

    return this.send(request)
      .then(response => response.segment(options))
  }

}

module.exports = CKIPClient
