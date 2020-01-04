'use strict'

const xml2js = require('xml2js')

class CKIPResponse {

  /**
   * Create a CKIPResponse.
   * @param {Buffer} data - The data received from the server response
   */
  constructor (data) {
    this.data = data
  }

  /**
   * Decode buffer and parse XML to JS object.
   *
   * @return {Promise} The parsed response.
   */
  parse () {
    const xml = this.data.toString()
    const parser = new xml2js.Parser()
    return parser.parseStringPromise(xml)
  }

  /**
   * Check process status of the parsed response.
   *
   * @param {Object} response - The parsed response.
   */
  checkStatus (response) {
    const statusCode = response.wordsegmentation.processstatus[0].$.code
    const processStatus = response.wordsegmentation.processstatus[0]._
    if (statusCode !== '0') throw new Error(processStatus)
  }

  /**
   * Segment sentences and words.
   *
   * @param {Object} options - The optional settings.
   * @param {boolean} options.tag - Part-of-speech tagging (POS tagging).
   * @return {Promise} The promise with segmented sentences and words.
   */
  segment (options = {}) {
    return this.parse().then(response => {
      this.checkStatus(response)
      const sentences = response.wordsegmentation.result[0].sentence

      return sentences.map(sentence => {
        const tokens = sentence.split('　')

        return tokens
          .filter(token => token)
          .map(token => {
            const segments = token.match(/(\S*)\((\S*)\)/)
            return options.tag ? { word: segments[1], tag: segments[2] } : segments[1]
          })
      })
    })
  }
}

module.exports = CKIPResponse
