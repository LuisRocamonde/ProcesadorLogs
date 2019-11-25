import React, {Component} from 'react';
import './MenuItem.css'

class MenuItem extends Component {

  render(){
  return (
    <div className="MenuItem">
      <li>
      <td href = '#'>{this.props.name[0]}</td>
      <td href = '#'>{this.props.name[1]}</td>
      </li>
    </div>
  );
}}

export default MenuItem;
