'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [sendText].map(_regenerator2.default.mark);

exports.sendText = sendText;

var _effects = require('redux-saga/effects');

function sendText(data, sessionId) {
  return _regenerator2.default.wrap(function sendText$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        _context.next = 2;
        return (0, _effects.put)({ type: 'send', data: { text: data }, sessionId });

      case 2:
      case 'end':
        return _context.stop();
    }
  }, _marked[0], this);
}