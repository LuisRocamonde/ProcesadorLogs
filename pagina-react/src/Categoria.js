import React, {Component} from 'react';
import MenuItem from './MenuItem'
import './Categoria.css'
import {Icon} from 'react-fa'

class Categoria extends Component {
  constructor(props){
    super(props);
    this.state = {
      visible:true
    }
  }

handleClick(event){
  event.preventDefault();
  this.setState({
    visible:!this.state.visible
  })
}

  render(){
  return (
    <div className="Categoria">
      <li>
      <h3 onClick={this.handleClick.bind(this)}><Icon className="icon" name={this.props.icon}/>{this.props.name}</h3>
      <ul className={this.state.visible?'visible':'no-visible'}>
        {this.props.items.map((item)=>{
          return <MenuItem name={item} key={item}/>
        })}
      </ul>
      </li>
    </div>
  );
}}

export default Categoria;
