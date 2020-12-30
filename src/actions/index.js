export const SET_ACCOUNTS = 'SET_ACCOUNTS';

export const setAccounts = accounts => ({
  type: SET_ACCOUNTS,
  payload: accounts
});


export const SET_JOURNAL_ENTRIES = 'SET_JOURNAL_ENTRIES';

export const setJournalEntries = journalEntries => ({
  type: SET_JOURNAL_ENTRIES,
  payload: journalEntries
});


export const SET_USER_INPUT = 'SET_USER_INPUT';

export const setUserInput = userInput => ({
  type: SET_USER_INPUT,
  payload: userInput
});
