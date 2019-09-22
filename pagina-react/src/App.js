import React, {Component} from 'react';
import Categoria from './Categoria'
import './App.css'
import web3 from 'web3'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logeado : false,
      control : -1,
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
    //const dataString = JSON.stringify(hash)
    //const hashedMessage = web3.keccak256("dataString");
    //console.log(hashedMessage)
    //const signedHash = account.sign(hashedMessage);
    fetch('http://127.0.0.1:5000/test/' + hash,{'mode': 'no-cors', method: 'POST'})
  }

  isEmpty(obj) {
      for(var key in obj) {
          if(obj.hasOwnProperty(key))
              return false;
      }
      return true;
  }

epochToDate(date){
  var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(date);
  return d.toString()
}


  //Devuelve un array de elementos con los varoles a mostrar en formato apropiado
  arrayElementos(log){
    var elementos = []
    var valorNuevo = JSON.parse(log["value"])
    if(!this.isEmpty(valorNuevo)){
      console.log(log["value"])
      var valor = Object.entries(valorNuevo[0])
      log["value"] = valor[1].toString().substring(valor[1].toString().indexOf(',')+1);
    } else{
      log["value"] = "null"
    }
    log["timestamp"] = this.epochToDate(log["timestamp"]);
      for(var key in log){
        if(key==="elementReference" || key==="elementQualifier" || key==="value" || key==="agent" || key==="timestamp"){
          elementos.push(key + " -> " + log[key])
        }
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

  funcionSubmit(user){
    console.log(user)
  /*  if(this.state["control"] > 3){
      console.log("SUBMIT");
      this.setState({
        logeado: true
      });
    } else{
      console.log("CONTROLSUB");
      console.log(this.state["control"])
      this.setState({
        control: this.state["control"] + 1
      });
    }*/
  }

  desloguear(){
    var control = false;
    if(control){
      console.log("FUERA");
      this.setState({
        logeado: false
      });
    } else{
      control = true;
      console.log("CONTROL");
    }

  }

  obtenerMedico(logs){
    var medico = "";
    logs.map(log => (medico = log["agent"]))
    return medico
  }

  render(){
    const { error, isLoaded, logs, logeado } = this.state;
    if(error){
      return <div>Error: {error.message}</div>;
    }
    else{
      if(logeado){
        if(logs){
          logs.map(log =>(this.eliminarNulos(log)))
          return (

            <div className="App">
            <ul className="horizontal">

              <li>{this.obtenerMedico(logs)}</li>
              <li class="rightli" style={{float:'right'}}>Ultima firma</li>
              <li><button onClick={this.desloguear()}>FUERA</button></li>
            </ul>
            {logs.map(log => (
              <ul>
               <Categoria name={this.epochToDate(log["timestamp"])} items={this.arrayElementos(log)} icon="cube"/>
              </ul>
              ))}
              <button onClick={this.handleClick.bind(this, JSON.stringify(logs))}>
              Firmar cambios
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
      } else{
        return(
          <div className="App">
          <ul className="horizontal">
            <li>{this.obtenerMedico(logs)}</li>
            <li className="rightli" style={{float:'right'}}>Ultima firma</li>
          </ul>

            <form className="formulario" onSubmit={this.funcionSubmit(document.getElementById("user"))}>
              <label className="labelUsuario">Usuario</label>
              <input className="textoUsuario" type="text" id="user" name="user" required size="20"/>
              <label className="labelContraseña">Contraseña</label>
              <input className="textoContraseña" type="password" id="pass" name="pass" required size="20"/>
              <input className="submit" type="submit" value="Iniciar Sesion"/>
            </form>
          </div>
        );
      }

    }
  }
}

export default App;
