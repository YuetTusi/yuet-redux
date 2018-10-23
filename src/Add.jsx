import React,{Component} from 'react';
import actionCreator from '../store/actions';

export default class Add extends Component{
    constructor(props){
        super(props);
        this.state={add:null};
    }
    static getDerivedStateFromProps(nextProps){
        return {
            add:nextProps.store.getState().add
        }
    }
    addClick=(e)=>{
        actionCreator.add(1);
    }
    render(){
        return (
            <div>
            <span>累加值：</span>
            <span>{this.state.add.addValue}</span>
            <button type="button" onClick={this.addClick}>+1</button>
            </div>
        );
    }
    componentDidUpdate(){

    }
}