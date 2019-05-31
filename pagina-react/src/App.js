import React, {Component} from 'react';
import Categoria from './Categoria'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items:[]
    };
  }

  componentDidMount() {
    fetch("http://127.0.0.1:5000/logs/")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }


  render(){
    const { error, isLoaded, items } = this.state;
    if(error){
      return <div>Error: {error.message}</div>;
    }
    else{
      return (
        <div className="App">
        {items.map(item => (
          <ul>
          <Categoria name={item.name} items={item.things} icon="file-text-o"/>
          </ul>
          ))}
        </div>
      );
    }
  }
}

export default App;
