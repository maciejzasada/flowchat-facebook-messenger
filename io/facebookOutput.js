import request from 'request';

export class FacebookOutput {

  static API_URI = 'https://graph.facebook.com/v2.6/me/messages';

  constructor(pageAccessToken) {
    this.pageAccessToken = pageAccessToken;
    this.subscribe = this._subscribe.bind(this);
    this._queue = [];
    this._isSending = false;
  }

  _subscribe({ data, sessionId }) {
    this._send(data, sessionId);
  }

  _send(data, recipientId) {
    this._queue.push({
      recipient: {
        id: recipientId
      },
      message: data
    });
    this._sendNext();
  }

  _sendNext() {
    if (this._queue.length === 0 || this._isSending) {
      return;
    }

    this._isSending = true;
    this._callSendAPI(this._queue.shift(), () => {
      this._isSending = false;
      this._sendNext();
    });
  }

  _callSendAPI(messageData, cb) {
    request({
      uri: FacebookOutput.API_URI,
      qs: { access_token: this.pageAccessToken },
      method: 'POST',
      json: messageData
    }, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        console.error('Failed calling Send API', response.statusCode, response.statusMessage,
          body.error);
      }
      cb && cb();
    });
  }

}
