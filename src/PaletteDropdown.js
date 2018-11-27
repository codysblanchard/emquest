import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default class PaletteDropdown extends React.Component{
  render(){
    return(
      <select value={this.props.val} onChange={this.props.changer}>
        {_.map(this.props.palette,(p,i)=>{
          return <option key={i} value={Math.round((p.minval + p.maxval) / 2)}>{p.emoji}</option>
        })}
      </select>
    )
  }
}
