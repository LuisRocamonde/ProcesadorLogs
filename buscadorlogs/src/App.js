import React from 'react';
import logo from './logo.svg';
import Categoria from './Categoria'
import './App.css';

function App() {
  return (
    <div className="App">
      <ul className="horizontal">
        <li>NOMBRE</li>
        <li className="rightli" style={{float:'right'}}>OK</li>
      </ul>
      <ul>
       <Categoria name="PATATA" items={['UNO','DOS','TRES']} icon="cube"/>
      </ul>
    </div>
  );
}

export default App;
