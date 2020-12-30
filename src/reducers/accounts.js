import * as actions from '../actions';

const initialState = [];

export default function accounts(state = initialState, action) {
  switch (action.type) {
    case actions.SET_ACCOUNTS:
      return action.payload;

    default:
      return state;
  }
}
