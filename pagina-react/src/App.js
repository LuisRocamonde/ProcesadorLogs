import React, {Component} from 'react';
import Categoria from './Categoria'
import './App.css'

class App extends Component {
  render(){
  return (
    <div className="App">
      <ul><Categoria name="Lenguajes" items={["HTML", "Java", "CSS"]} icon="file-text-o"/>
        <Categoria name="Frameworks" items={["Express", "Hibernate", "Spring"]} icon="cube"/>
        <Categoria name="Estructuras" items={["Div", "Lista", "Header"]} icon="anchor"/>
        <Categoria name="Enlaces" items={["Enlace1", "Enlace2", "Enlace3"]} icon="comment-o"/>
      </ul>
    </div>
  );
}}

export default App;
