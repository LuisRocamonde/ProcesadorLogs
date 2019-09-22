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
      logs: [],
      valueNombre: '',
      valuePass: '',
      nombreCorrecto:'luisr',
      passCorrecta:'login'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
  }

  handleChange(event) {
  this.setState({valueNombre: event.target.value});
}

  handleSubmit(event) {
    if(this.state.valueNombre==this.state.nombreCorrecto && this.state.valuePass==this.state.passCorrecta){
      this.setState({
        logeado: true
      });
    } else{
      alert('PATRAS' + this.state.valuePass);
    }

    event.preventDefault();
  }

  handleChange2(event) {
  this.setState({valuePass: event.target.value});
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
              <li className="rightli" style={{float:'right'}}>Ultima firma</li>
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

            <form className="formulario" onSubmit={this.handleSubmit}>
              <label className="labelUsuario">Usuario</label>
              <input className="textoUsuario" type="text" value={this.state.valueNombre} onChange={this.handleChange} required size="20"/>
              <label className="labelContraseña">Contraseña</label>
              <input className="textoContraseña" type="password" value={this.state.valuePass} onChange={this.handleChange2} required size="20"/>
              <input className="submit" type="submit" value="Iniciar Sesion"/>
            </form>
          </div>
        );
      }

    }
  }
}

export default App;
