import React, {Component} from 'react';
import Categoria from './Categoria'
import './App.css'
import web3 from 'web3'

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
    for(var key in log){
      if(log[key]==null){
        log[key]=""
      }
    }
  }

//Envia datos al servidor
  handleClick(hash){
    const dataString = JSON.stringify(hash)
    const hashedMessage = web3.keccak256("dataString");
    console.log(hashedMessage)
    //const signedHash = account.sign(hashedMessage);
    fetch('http://127.0.0.1:5000/test/' + hash,{'mode': 'no-cors', method: 'POST'})
  }

  //Devuelve un array de elementos con los varoles a mostrar en formato apropiado
  arrayElementos(log){
    var elementos = []
    console.log(JSON.parse(log["value"]))
    //log["value"].map(datos =>(console.log("DATOS "+datos)))
    log["_id"]= log["_id"]["$oid"]
    for(var key in log){
        elementos.push(log[key])
    }
    return elementos
  }

  componentDidMount() {
    fetch("http://127.0.0.1:5000/logs/")
      .then(res => res.json())
      .then(
        (result) => {

          this.setState({
            logs: JSON.parse(result)
          });
        ;},
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
             <Categoria name={log["timestamp"]} items={this.arrayElementos(log)} icon="cube"/>
            </ul>
            ))}
            <button onClick={this.handleClick.bind(this, 'TINO')}>
            CLICKEAME
            </button>
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
