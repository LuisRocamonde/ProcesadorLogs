import React, {Component} from 'react';
import Categoria from './Categoria'
import './App.css';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import DatePicker from 'react-date-picker';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      logueado: 0,
      //nombreCorrecto:'carlos.peña',
      //passCorrecta:'admin',
      nombreCorrecto:'a',
      passCorrecta:'a',
      valueNombre: '',
      trans: [],
      logs:[],
      datos: [],
      tx_hash: [],
      dataDefault: new Date(),
      dataInicio: new Date(),
      dataFin: new Date(),
      valueDoctor: '',
      valueVariable: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit2 = this.handleSubmit2.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);
    this.handleChange4 = this.handleChange4.bind(this);

  }

  onChangeI = dataInicio => this.setState({ dataInicio })

  onChangeF = dataFin => this.setState({ dataFin })

  handleChange(event) {
  this.setState({valueNombre: event.target.value});
}

  handleChange2(event) {
    this.setState({valuePass: event.target.value});
  }

  handleChange3(event) {
    this.setState({valueDoctor: event.target.value});
  }

  handleChange4(event) {
    this.setState({valueVariable: event.target.value});
  }

  handleSubmit(event) {
    if(this.state.valueNombre===this.state.nombreCorrecto && this.state.valuePass===this.state.passCorrecta){
      this.setState({
        logeado: 1
      });
    } else{
      alert('ATRAS' + this.state.valuePass);
    }
    event.preventDefault();
  }

  handleSubmit2(event) {
    if(this.state.dataInicio<=this.state.dataFin){
      this.setState({
        logeado: 2
      });
      this.obtenerBusqueda();
    } else{
      alert('ATRAS FECHAS MAL');
      this.setState({
        dataInicio: this.state.dataDefault,
        dataFin: this.state.dataDefault
      });
    }
    this.recuperarLogs();
    event.preventDefault();
  }

  obtenerBusqueda(){
    fetch("http://127.0.0.1:5000/busqueda/" + this.state.valueDoctor + "/" + this.state.valueVariable + "/" + this.state.dataInicio.getTime() + "/" + this.state.dataFin.getTime())
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          trans: JSON.parse(result)
        });
        console.log("\n\nRESULTADO LOG " + this.setState.logs)
      ;},
      (error) => {
        this.setState({
          error
        });
      }
    )
  }

  recuperarLogs(){
    fetch("http://127.0.0.1:5000/busquedaLog/" + this.state.valueDoctor + "/" + this.state.valueVariable + "/" + this.state.dataInicio.getTime() + "/" + this.state.dataFin.getTime())
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          logs: JSON.parse(result)
        });
        console.log("\n\nRESULTADO LOG " + this.setState.logs)
      ;},
      (error) => {
        this.setState({
          error
        });
      }
    )
  }

  obtenerMapa(mapa){
    var map=[]
    var map2= []
    map = Object.entries(mapa)
    Object.entries(map[1]).forEach((key, value) => {
       map2.push(Object.entries(key[1]))
     });
     var mapaF = new Map()
     for (var key in map2[1]){
       mapaF.set(map2[1][key][0], map2[1][key][1])
     }
    //console.log("ObtenerMapa " + JSON.parse(map["result"]))
    //map2 = Object.entries(map["result"])
    return mapaF
  }

  eliminarNulos(log){
    for(var key in log){
      if(log[key]==null){
        log[key]=""
      }
    }
  }

  parsearLogs(log){
    var array = []
    var arrayAux = []
    var datos = this.state.datos
    array.push(JSON.parse(log.log))
    arrayAux = array[0]
    for (var key in arrayAux){
      this.eliminarNulos(arrayAux[key])
      datos.push(arrayAux[key])
    }
    this.setState({
      datos: datos
    });
  }

  render(){
    const {logeado, logs} = this.state;
    if(logeado === 2){
      if(logs){
        logs.map(log =>(this.parsearLogs(log)))
        return (
          <div className="App">
            <ul className="horizontal">
              <li>{this.state.valueNombre}</li>
              <li className="rightli" style={{float:'right'}}>OK</li>
            </ul>
            {logs.map(log => (
            <ul>
             <Categoria name="PATATA" items={['UNO','DOS','TRES']} icon="cube"/>
            </ul>
            ))}
          </div>
        );
      }
    }
    else if(logeado === 1){
      return (
        <div className="App">
        <ul className="horizontal">
          <li>PROCARDIA BUSCADOR</li>
          <li className="rightli" style={{float:'right'}}>Login</li>
        </ul>

          <form className="formulario" onSubmit={this.handleSubmit2}>
            <label className="doctor">Doctor</label>
            <input className="textoDoctor" type="text" value={this.state.valueDoctor} onChange={this.handleChange3} required size="20"/>
            <label className="labelFecha">Fecha Inicio</label>
            <label className="labelFecha">Fecha Fin</label>
            <DatePicker className="fechaInicio" onChange={this.onChangeI} value={this.state.dataInicio}/>
            <DatePicker className="fechaFin" onChange={this.onChangeF} value={this.state.dataFin}/>
            <label className="labelVariable">Variable</label>
            <input className="textoVariable" type="password" value={this.state.valueVariable} onChange={this.handleChange4} required size="20"/>
            <input className="submit" type="submit" value="Realizar Busqueda"/>
          </form>
        </div>
      );
    }
    else {
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

export default App;
