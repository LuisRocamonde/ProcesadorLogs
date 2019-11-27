import React, {Component} from 'react';
import './MenuItem.css'

class MenuItem extends Component {

  render(){
  return (

      <tr>
      <td href = '#'>{this.props.name}</td>
      <td href = '#'>{this.props.name}</td>
      </tr>

  );
}}

export default MenuItem;
