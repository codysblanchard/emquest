import React from 'react';
import _ from 'lodash';
import Renderer from "../renderer.js"
import Utils from './Utils.js';
var u = new Utils();
import PaletteDropdown from './PaletteDropdown';
import EncounterEditCell from './EncounterEditCell';

export default class EncountersEdit extends React.Component{
  constructor(props){
    super(props);
    this.state={
      encounters:[],
      sort:'id',
      sortDir:1
    };
    u.ajax(u.api+"encounters/get",null,(e)=>{
      this.setState({
        encounters:e
      })
    })
  }
  createEncounter(){
    this.setState({
      encounters:[{id:'new',emoji:'hi',fatigue:0,fatiguemin:0,fatiguemax:0,text:'',rarity:0,terrainmin:0,terrainmax:0}].concat(this.state.encounters)
    })
  }
  setSort(c){
    this.setState({
      sort:c.toLowerCase().replace(/\s/g,''),
      sortDir:-this.state.sortDir
    })
  }
  handleInput(id,field,e){
    this.updateEncounter({id:id=='savenew' ? 'new' : id},_.set({},field,id=='savenew' ? 'savenew' : e.target.value),_.debounce(_.bind(this.saveEncounter,this,id),1000))
  }
  updateEncounter(e,updates,cb){
    var i  = _.findIndex(this.state.encounters,{id:e.id});
    this.setState({
      encounters:this.state.encounters.slice(0,i)
                  .concat(_.merge({},this.state.encounters[i],updates))
                  .concat(this.state.encounters.slice(i+1))
    },()=>{window.dispatchEvent(new CustomEvent("encounters.updated",{detail:this.state.encounters})); cb()});
  }
  saveEncounter(id){
    if(id=='new')return;
    u.ajax(u.api+"encounters/save", {encounter:_.find(this.state.encounters,{id:id})},(e)=>{

    })
  }
  render(){
    var bigRows=["Text"]
    var paletteRows=['Terrain Min','Terrain Max']
    var fields = ['Emoji','Text','Rarity','Fatigue','Fatigue Min','Fatigue Max','Terrain Min','Terrain Max','X','Y'];
    var sorted = _.sortBy(this.state.encounters,this.state.sort);
    if(this.state.sortDir==-1)sorted=sorted.reverse();

    return (<div>
      <a onClick={this.createEncounter.bind(this)} className='button'>Create</a>
      <div className='row'>
      {_.map(fields,(c,i)=>{
        return <div key={i} className={'cell'+(_.indexOf(bigRows,c)>-1 ? ' xbig': '')} onClick={_.bind(this.setSort,this,c)}>{c}</div>
      })}

      </div>
      {_.map(sorted,(e,i)=>{
        return <EncounterEditCell key={i} rowKey={i} fields={fields} bigRows={bigRows} paletteRows={paletteRows} handleInput={this.handleInput.bind(this)} encounter={e} palette={this.props.palette}/>
      })}
    </div>)
  }
}
