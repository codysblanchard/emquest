import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import MapCanvas from './MapCanvas.js'
import Renderer from "../renderer.js"
import PaletteDropdown from './PaletteDropdown';
import Utils from './Utils.js';
var u = new Utils();

 export default class MapEdit extends React.Component{
   constructor(props){
     super(props);
     this.mouseDown=false;
     this.state = { map: {}, zoom:8,palette:{},paint:0,preview:''};
     u.ajax(u.api+'map/get',null,(map)=>{
          this.setState({map:map}) //,this.drawMap.bind(this))
     });
   }

   saveMap(){
    u.ajax(u.api+"map/save",{mapData:this.state.map},(r)=>{
       console.log(r);
     })
   }
   genMap(){
     u.ajax(u.api+"map/gen",null,(map)=>{
       this.setState({map:map})//,this.drawMap.bind(this))
     })
   }
   mapClick(x,y){

     if(this.refs.mapCanvas.mouseDown){
       if(!_.isEmpty(_.find(this.state.map,{x:x,y:y,val:this.state.paint})))return;
       var index=_.findIndex(this.state.map,{x:x,y:y});
       var m = _.clone(this.state.map);
       m.splice(index,1,{x:x,y:y,val:this.state.paint});


       this.setState({
         map:m
       })
     }
     else{
       this.setState({
         preview:Renderer.build({bg:[Renderer.getPaletteFromCell(this.props.palette, _.find(this.state.map,{x:x,y:y}))]})
       })
     }
   }
   changeZoom(e){
     this.setState({
       zoom:e.target.value
     })
   }
   paletteClick(p){
     console.log(p.target.value);
     this.setState({
       paint:p.target.value
     })
   }

  render(){
    var u = _.first(this.props.users) || {};
    var encounter = Renderer.rollDice(u.x,u.y,u.fatigue,_.get(_.find(this.state.map,{x:u.x,y:u.y}),'val'),this.props.encounters);

    return (
      <div>
        <div>
          <a className='button' onClick={this.genMap.bind(this)}>Generate </a>
          <a className='button' onClick={this.saveMap.bind(this)}>Save </a>
          Zoom: <input type='number' value={this.state.zoom} onChange={this.changeZoom.bind(this)}/>

          Paint: <PaletteDropdown palette={[{minval:0,maxval:0,emoji:'⬛'}].concat(this.props.palette)} val={this.state.paint} changer={this.paletteClick.bind(this)}/>
        </div>
        <MapCanvas ref='mapCanvas'
          width={this.state.zoom*99}
          height={this.state.zoom*99}
          zoom={this.state.zoom}
          map={this.state.map}
          palette={this.props.palette}
          mapClick={this.mapClick.bind(this)}
          users={this.props.users}
          />
        <textarea id='preview' onChange={_} value={this.state.preview}>

        </textarea>

        <textarea id='preview2' onChange={_} value={Renderer.build({encounter:encounter,bg:[Renderer.getPaletteFromCell(this.props.palette, _.find(this.state.map,{x:_.get(_.get(this.props.users,0),'x'),y:_.get(_.get(this.props.users,0),'y')}))]})}>
        </textarea>


      </div>
    );
  }
}
