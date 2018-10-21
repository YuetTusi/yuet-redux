import {
  ADD,
  MINUS
} from './action-types/counter';

export function add(payload) {
  return {
    type: ADD,
    payload
  };
}

export function minus(payload) {
  return {
    type: MINUS,
    payload
  };
}