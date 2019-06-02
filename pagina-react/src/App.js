import React, {Component} from 'react';
import Categoria from './Categoria'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      logs: []
    };
  }

  //Elimina los valores nulos de los atributos del log
  eliminarNulos(log){
    console.log(log)
    for(var key in log){
      if(log[key]==null){
        log[key]=""
      }
    }
  }

  //Devuelve un array de elementos con los varoles a mostrar en formato apropiado
  arrayElementos(log){
    var elementos = []
    log["value"] = this.parsearValue(log["value"])
    log["_id"]= log["_id"]["$oid"]
    for(var key in log){
        elementos.push(log[key])
    }
    return elementos
  }

  //Parsea el string del atributo "value" para devolver solo el valor actual
  parsearValue(value){
    var string = value.split("\"stringValue\":\"")
    var valueParseado = string[1].split("\"")

    return valueParseado[0]
  }

  componentDidMount() {
    fetch("http://127.0.0.1:5000/logs/")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            logs: result
          });
        console.log(result);},
        (error) => {
          this.setState({
            error
          });
        }
      )
  }


  render(){
    const { error, isLoaded, logs } = this.state;
    if(error){
      return <div>Error: {error.message}</div>;
    }
    else{
      if(logs){
        logs.map(log =>(this.eliminarNulos(log)))
        return (
          <div className="App">
          {logs.map(log => (
            <ul>
            <Categoria name={log.elementReference} items={this.arrayElementos(log)} icon="file-text-o"/>
            </ul>
            ))}
          </div>
        );
      } else if(isLoaded){

      }
      else{
        return(
          <h1>FALLO</h1>
        )
      }
    }
  }
}

export default App;
