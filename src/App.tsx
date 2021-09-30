import React from 'react';
import logo from './icons/cards.png';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Amerikanerne
        </p>
      </header>
    </div>
  );
}

export default App;
