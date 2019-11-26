import React, {Component} from 'react';
import './MenuItem.css'

class MenuItem extends Component {

  render(){
  return (

      <tr>
      <td href = '#'>{this.props.name[0]}</td>
      <td href = '#'>{this.props.name[1]}</td>
      </tr>

  );
}}

export default MenuItem;
