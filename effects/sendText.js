import { put } from 'redux-saga/effects';

export function* sendText(data, sessionId) {
  yield put({ type: 'send', data: { text: data }, sessionId });
}
