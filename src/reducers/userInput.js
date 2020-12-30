import * as actions from '../actions';

const initialState = {
  startAccount: undefined,
  endAccount: undefined,
  startPeriod: undefined,
  endPeriod: undefined,
  format: undefined
};

export default function userInput(state = initialState, action) {
  switch (action.type) {
    case actions.SET_USER_INPUT:
      return action.payload;

    default:
      return state;
  }
}
