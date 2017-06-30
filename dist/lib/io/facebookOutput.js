'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FacebookOutput {

  constructor(pageAccessToken) {
    this.pageAccessToken = pageAccessToken;
    this.subscribe = this._subscribe.bind(this);
  }

  _subscribe(output) {
    this._send(output.data, output.sessionId);
  }

  _send(data, recipientId) {
    this._callSendAPI({
      recipient: {
        id: recipientId
      },
      message: data
    });
  }

  _callSendAPI(messageData) {
    (0, _request2.default)({
      uri: FacebookOutput.API_URI,
      qs: { access_token: this.pageAccessToken },
      method: 'POST',
      json: messageData
    }, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        console.error('Failed calling Send API', response.statusCode, response.statusMessage, body.error);
      }
    });
  }

}
exports.default = FacebookOutput;
FacebookOutput.API_URI = 'https://graph.facebook.com/v2.6/me/messages';