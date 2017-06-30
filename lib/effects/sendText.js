import { put } from 'redux-saga/effects';

export default function* (data, sessionId) {
  yield put({ type: 'send', data: { text: data }, sessionId });
}
