import React from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators} from '../redux';
import {
  store,
  reducer
} from '../store';
import actionCreators from '../store/actions';

let actions=bindActionCreators(actionCreators,store.dispatch);

export default class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      add:{
        addValue:store.getState().add.addValue
      },
      minus:{
        minusValue:store.getState().minus.minusValue
      }
    };
  }
  componentWillMount(){
    store.subscribe(()=>{
      this.setState({
        add:{
          addValue:store.getState().add.addValue
        },
        minus:{
          minusValue:store.getState().minus.minusValue
        }
      });
    });
  }
  addClick=(e)=>{
    actionCreators.add(1);
  }
  minusClick=(e)=>{
    actionCreators.minus(1);
  }
  render() {
    return (
      <div>
        <h2>手写redux源码测试</h2>
        <div>
          <span>累加：</span>
          <span>{this.state.add.addValue}</span>
          <button type="button" onClick={this.addClick}>+1</button>
        </div>
        <div>
          <span>递减：</span>
          <span>{this.state.minus.minusValue}</span>
          <button type="button" onClick={this.minusClick}>-1</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render( <Index/> , document.querySelector('#root'));