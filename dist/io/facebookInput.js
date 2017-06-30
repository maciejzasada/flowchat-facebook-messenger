'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FacebookInput = undefined;

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _rxLite = require('rx-lite');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FacebookInput {

  constructor(appSecret, verifyToken) {
    this.appSecret = appSecret;
    this.verifyToken = verifyToken;

    this._subject = new _rxLite.Subject();
    this._app = (0, _express2.default)();
    this._app.use(_bodyParser2.default.json({ verify: this.verifyRequestSignature.bind(this) }));
    this._app.get('/webhook', this.getWebhook.bind(this));
    this._app.post('/webhook', this.postWebhook.bind(this));
  }

  get subject() {
    return this._subject;
  }

  listen(port) {
    this._app.listen(port, () => {
      console.log(`Facebook input listening on port ${port} at /webhook`);
      console.log('Press Ctrl+C to quit.');
    });
  }

  verifyRequestSignature(req, res, buf) {
    var signature = req.headers['x-hub-signature'];

    if (!signature) {
      throw new Error('Could not validate signature');
    } else {
      const elements = signature.split('=');
      const signatureHash = elements[1];

      var expectedHash = _crypto2.default.createHmac('sha1', this.appSecret).update(buf).digest('hex');

      if (signatureHash !== expectedHash) {
        throw new Error('Could not validate the request signature.');
      }
    }
  }

  getWebhook(req, res) {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === this.verifyToken) {
      console.log('Validating webhook');
      res.status(200).send(req.query['hub.challenge']);
    } else {
      console.error('Failed validation. Make sure the verify tokens match.');
      res.sendStatus(403);
    }
  }

  postWebhook(req, res) {
    const data = req.body;

    if (data.object === 'page') {
      data.entry.forEach(pageEntry => {
        const pageID = pageEntry.id;
        const timeOfEvent = pageEntry.time;

        pageEntry.messaging.forEach(messagingEvent => {
          this.receive(messagingEvent);
        });
      });

      res.sendStatus(200);
    }
  }

  receive(event) {
    const eventCopy = (0, _assign2.default)({}, event);
    const data = eventCopy.message;
    const state = {};
    const sessionId = event.sender.id;

    delete eventCopy.message;
    data.event = eventCopy;
    eventCopy.mid = data.mid;
    eventCopy.seq = data.seq;
    delete data.mid;
    delete data.seq;

    this.subject.onNext({ data, state, sessionId });
  }
}
exports.FacebookInput = FacebookInput;