import * as actions from '../actions';

const initialState = [];

export default function journal(state = initialState, action) {
  switch (action.type) {
    case actions.SET_JOURNAL_ENTRIES:
      return action.payload;

    default:
      return state;
  }
}
