import { combineReducers } from 'redux';
import accounts from './accounts';
import journalEntries from './journal';
import userInput from './userInput';

export default combineReducers({
  accounts,
  journalEntries,
  userInput
});
