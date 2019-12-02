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
      nombreCorrecto:'carlos.peña',
      passCorrecta:'admin',
      ultimaFirma: '',
      ultimaFirmaDate: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
  }

  handleChange(event) {
  this.setState({valueNombre: event.target.value});
}

  handleSubmit(event) {
    if(this.state.valueNombre===this.state.nombreCorrecto && this.state.valuePass===this.state.passCorrecta){
      this.setState({
        logeado: true
      });
    } else{
      alert('ATRAS' + this.state.valuePass);
    }
    this.actualizarLogs();
    console.log("RECOGER")
    this.recogerFirma();
    event.preventDefault();
  }

  recogerFirma(){
    fetch("http://127.0.0.1:5000/ultimaFirma/" + this.state.valueNombre)
      .then(res => res.toString())
      .then(
        (result) => {
          console.log("RESULT FIRMA" + result + " " + typeof result)
          this.setState({
            ultimaFirma: result
          });
          //console.log("RESULTITO " + this.setState.ultimaFirma)
          //this.setState.ultimaFirma.map(firma =>(this.fechaUltimaFirma(firma)))
        ;},
        (error) => {
          this.setState({
            error
          });
        }
      )
      console.log("FIRMA")
      var uF = this.state.ultimaFirma
      //uF.map(firma =>(this.fechaUltimaFirma(firma)))
      //console.log("FIRMA" + this.state.ultimaFirma.map(firma =>(this.epochToDate(firma["fecha"]))))
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
  handleClick(hash, doctor){
    //const dataString = JSON.stringify(hash)
    //const hashedMessage = web3.keccak256("dataString");
    //console.log(hashedMessage)
    //const signedHash = account.sign(hashedMessage);
    fetch('http://127.0.0.1:5000/firma/' + doctor + '/' + hash,{'mode': 'no-cors', method: 'POST'})
  }

  isEmpty(obj) {
      for(var key in obj) {
          if(obj.hasOwnProperty(key))
              return false;
      }
      return true;
  }

epochToDate(date){
  var d = new Date(date); // The 0 there is the key, which sets the date to the epoch
  //d.setUTCSeconds(date);
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var hours = d.getHours();
  var minutes = d.getMinutes();
  var seconds = d.getSeconds();
;
  return day + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds;
}


  //Devuelve un array de elementos con los varoles a mostrar en formato apropiado
  arrayElementos(log){
    var elementos = []
    var elementos2 = []
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
          elementos2.push(key.toUpperCase() )
          elementos2.push(log[key])
          elementos.push(elementos2)
          elementos2 = []
        }
      }


    return elementos
  }

  actualizarLogs() {
    fetch("http://127.0.0.1:5000/logs/" + this.state.valueNombre)
      .then(res => res.json())
      .then(
        (result) => {

          this.setState({
            logs: JSON.parse(result)
          });
          console.log("RESULTADO LOG " + this.setState.logs)
        ;},
        (error) => {
          this.setState({
            error
          });
        }
      )
  }

  fechaUltimaFirma(firma){
      console.log("FECHA : " + firma)
      return "OK "
  }

  render(){
    const { error, isLoaded, logs, logeado, ultimaFirma } = this.state;
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

              <li>{this.state.valueNombre}</li>
              <li className="rightli" style={{float:'right'}}>OK</li>
            </ul>
            {logs.map(log => (
              <ul>
               <Categoria name={this.epochToDate(log["timestamp"])} items={this.arrayElementos(log)} icon="cube"/>
              </ul>
              ))}
              <button onClick={this.handleClick.bind(this, JSON.stringify(logs), this.state.valueNombre)} className="botonFirma">
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
            <li>PROCARDIA BLOCKCHAIN</li>
            <li className="rightli" style={{float:'right'}}>Login</li>
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
