import React, { Component } from 'react';
import InputForm from './InputForm';
import BalanceOutput from './BalanceOutput';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h2>Little Accountant</h2>
        <InputForm />
        <br />
        <BalanceOutput />
      </div>
    );
  }
}

export default App;
