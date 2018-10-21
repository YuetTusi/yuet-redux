import React from 'react';
import ReactDOM from 'react-dom';
import {
  store
} from '../store';

export default class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      number: store.getState().number
    };
  }
  addClick=(e)=>{
    store.dispatch({type:'ADD',payload:1});
  }
  minusClick=(e)=>{
    store.dispatch({type:'MINUS',payload:1});
  }
  componentWillMount(){
    store.subscribe(()=>{
      this.setState({
        number:store.getState().number
      });
    });
  }
  render() {
    return (
      <div>
      <h1>
        <span>Number:</span>
        <span>{this.state.number}</span>
      </h1>
      <button type="button" onClick={this.addClick}>add</button>
      <button type="button" onClick={this.minusClick}>minus</button>
      </div>
    );
  }
  componentDidUpdate(prevProps,prevState,snapshot){

  }
}

ReactDOM.render( <Index/> , document.querySelector('#root'));