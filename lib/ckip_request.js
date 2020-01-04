'use strict'

const xml2js = require('xml2js')

class CKIPRequest {

  /**
   * Create a CKIPRequest.
   *
   * @param {Object} options - The optional settings.
   * @param {Object} options.authentication - The credentials used to authenticate.
   * @param {Object} options.authentication.username - The username for authentication.
   * @param {Object} options.authentication.password - The password for authentication.
   * @param {Object} options.text - The text to segment.
   */
  constructor (options) {
    this.data = this.build(options)
  }

  /**
   * Build XML buffer for request.
   *
   * @param {Object} options - The optional settings.
   * @param {Object} options.authentication - The credentials used to authenticate.
   * @param {Object} options.authentication.username - The username for authentication.
   * @param {Object} options.authentication.password - The password for authentication.
   * @param {Object} options.text - The text to segment.
   * @return {Buffer} - The Buffer of XML.
   */
  build (options) {
    const builder = new xml2js.Builder({
      xmldec: { version: '1.0' },
      renderOpts: { pretty: false }
    })

    const xml = builder.buildObject({
      wordsegmentation: {
        $: { version: '0.1', charsetcode: 'utf-8' },
        option: {
          $: { showcategory: 1 }
        },
        authentication: {
          $: options.authentication
        },
        text: options.text
      }
    })

    return Buffer.from(xml)
  }
}

module.exports = CKIPRequest
