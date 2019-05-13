import React, {Component} from 'react';

class MenuItem extends Component {

  render(){
  return (
    <div className="MenuItem">
      <li>
      <a href = '#'>{this.props.name}</a>
      </li>
    </div>
  );
}}

export default MenuItem;
