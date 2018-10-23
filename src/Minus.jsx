import React,{Component} from 'react';
import {Consumer} from './context';

export default class Minus extends Component{
    constructor(props){
        super(props);
        this.state={minus:null};
    }
    static getDerivedStateFromProps(nextProps){
        return {
            minus:nextProps.store.getState().minus
        }
    }
    render(){
        return (
            <div>
            <span>递减值：</span>
            <span>{this.state.minus.minusValue}</span>
            <button type="button">-1</button>
            </div>
        );
    }
    componentDidUpdate(){

    }
}