import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import * as utils from '../utils';

class BalanceOutput extends Component {
  render() {
    if (!this.props.userInput.format) {
      return null;
    }

    return (
      <div className='output'>
        <p>
          Total Debit: {this.props.totalDebit} Total Credit: {this.props.totalCredit}
          <br/>
          Balance from account {this.props.userInput.startAccount || '*'}
          {' '}
          to {this.props.userInput.endAccount || '*'}
          {' '}
          from period {utils.dateToString(this.props.userInput.startPeriod)}
          {' '}
          to {utils.dateToString(this.props.userInput.endPeriod)}
        </p>
        {this.props.userInput.format === 'CSV' ? (
          <pre>{utils.toCSV(this.props.balance)}</pre>
        ) : null}
        {this.props.userInput.format === 'HTML' ? (
          <table className="table">
            <thead>
            <tr>
              <th>ACCOUNT</th>
              <th>DESCRIPTION</th>
              <th>DEBIT</th>
              <th>CREDIT</th>
              <th>BALANCE</th>
            </tr>
            </thead>
            <tbody>
            {this.props.balance.map((entry, i) => (
              <tr key={i}>
                <th scope="row">{entry.ACCOUNT}</th>
                <td>{entry.DESCRIPTION}</td>
                <td>{entry.DEBIT}</td>
                <td>{entry.CREDIT}</td>
                <td>{entry.BALANCE}</td>
              </tr>
            ))}
            </tbody>
          </table>
        ) : null}
      </div>
    );
  }
}

BalanceOutput.propTypes = {
  balance: PropTypes.arrayOf(
    PropTypes.shape({
      ACCOUNT: PropTypes.number.isRequired,
      DESCRIPTION: PropTypes.string.isRequired,
      DEBIT: PropTypes.number.isRequired,
      CREDIT: PropTypes.number.isRequired,
      BALANCE: PropTypes.number.isRequired
    })
  ).isRequired,
  totalCredit: PropTypes.number.isRequired,
  totalDebit: PropTypes.number.isRequired,
  userInput: PropTypes.shape({
    startAccount: PropTypes.number,
    endAccount: PropTypes.number,
    startPeriod: PropTypes.date,
    endPeriod: PropTypes.date,
    format: PropTypes.string
  }).isRequired
};

/**
 * Determines whether a value is between a given range.
 *
 * When one of the range delimiters is NaN:
 *  - If it's the lower bound, value must be equal/lower than upper bound
 *  - If it's the upper bound, valuet must be equal/greater than lower bound
 *
 * @param {number|NaN} start
 * @param {number|NaN} end
 * @param {number} value
 */
function valueBetweenRange(start, end, value) {
  // Ranges are * *, so any accountNumber is valid
  if (isNaN(start) && isNaN(end)) {
    return true;
  }

  // Ranges are (*, number) or (number, *)
  if (isNaN(start) || isNaN(end)) {
    return isNaN(start) ? value <= end : value >= start;
  }

  return value >= start && value <= end;
}

export default connect(state => {
  let balance = [];

  const {accounts, journalEntries, userInput: {startPeriod, endPeriod, startAccount, endAccount, format}} = state;
  // Filter accounts
  const filteredAccounts = accounts
    .filter((instance) => valueBetweenRange(startAccount, endAccount, instance.ACCOUNT))

  // Extract numbers only for easy filtering of journal entries
  const filteredAccountsKeys = filteredAccounts.map((instance) => instance.ACCOUNT)

  // Filter/sort journals
  const validJournalEntries = journalEntries.filter((instance) => {
    // Periods must be defined in order to filter
    if (!startPeriod || !endPeriod) {
      return;
    }

    // Check if the entry belongs to a relevant account
    if (filteredAccountsKeys.indexOf(instance.ACCOUNT) < 0) {
      return;
    }

    return valueBetweenRange(startPeriod.getTime(), endPeriod.getTime(), instance.PERIOD)
  })

  balance = filteredAccounts.map((account) => {
    const line = {
      ACCOUNT: account.ACCOUNT,
      DESCRIPTION: account.LABEL,
      DEBIT: 0,
      CREDIT: 0,
      BALANCE: 0
    };
    return validJournalEntries
      .filter((entry) => entry.ACCOUNT === account.ACCOUNT)
      .reduce((acc, entry) => {
        acc.DEBIT += entry.DEBIT
        acc.CREDIT += entry.CREDIT
        acc.BALANCE = acc.DEBIT - acc.CREDIT
        return acc
      }, line)
  }).filter((line) => line.DEBIT !== 0 || line.CREDIT !== 0)

  const totalCredit = balance.reduce((acc, entry) => acc + entry.CREDIT, 0);
  const totalDebit = balance.reduce((acc, entry) => acc + entry.DEBIT, 0);

  return {
    balance,
    totalCredit,
    totalDebit,
    userInput: state.userInput
  };
})(BalanceOutput);
