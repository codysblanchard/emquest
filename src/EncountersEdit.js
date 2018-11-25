import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Renderer from "../renderer.js"
import Utils from './Utils.js';
var u = new Utils();

export default class EncountersEdit extends React.Component{
  constructor(props){
    super(props);
    this.state={
      encounters:[]
    };
  }
  createEncounter(){
    this.setState({
      encounters:[{emoji:'hi',fatigue:0,fatiguemin:0,fatiguemax:0,text:'',rarity:0,terrain:0}].concat(this.state.encounters)
    })
  }
  render(){
    return (<div>
      <a onClick={this.createEncounter.bind(this)} className='button'>Create</a>
      {_.map(this.state.encounters,(e,i)=>{
          return <div key={i}>
                  {e.emoji}
                </div>
      })}
    </div>)
  }
}
