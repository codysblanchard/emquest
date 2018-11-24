import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import MapCanvas from './MapCanvas.js'
import Renderer from "../renderer.js"

 class Admin extends React.Component{
   constructor(props){
     super(props);
     this.mouseDown=false;
     this.state = { map: {}, zoom:8,palette:{},paint:0,preview:'hi'};
     this.api="http://localhost:3000/api/";
     this.ajax(this.api+'map/get',null,(map)=>{
       this.ajax(this.api+'palette/get',null,(palette)=>{
         this.setState({palette:palette,map:map}) //,this.drawMap.bind(this))
       })
     });
   }
   componentDidMount(){
     this.mounted=true;
   }
   ajax(uri,params,cb){
     if(this.mounted)this.setState({loading:true})
      var conf={
        method:_.isEmpty(params) ? 'GET' : 'POST',
        body:_.isEmpty(params) ? null : JSON.stringify(params)
      };
      if(!_.isEmpty(params))conf.headers={
          'Content-Type': 'application/json'
        }
      fetch(uri,conf).then(res => res.json())
      .then(response=>{this.setState({loading:false});cb(response)});
      return;

   }
   saveMap(){
    this.ajax(this.api+"map/save",{mapData:this.state.map},(r)=>{
       console.log(r);
     })
   }
   genMap(){
     this.ajax(this.api+"map/gen",null,(map)=>{
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
         preview:Renderer.build({bg:[Renderer.getPaletteFromCell(this.state.palette, _.find(this.state.map,{x:x,y:y}))]})
       })
     }
   }
   changeZoom(e){
     this.setState({
       zoom:e.target.value
     })
   }
   paletteClick(p){
     console.log(p);
     this.setState({
       paint:Math.round(p.minval + (p.maxval-p.minval)/2)
     })
   }

  render(){
    return (
      <div>
        {this.state.loading ? <div id='loading'>LOADING</div> : null }
        <div>
          <a className='button' onClick={this.genMap.bind(this)}>Generate </a>
          <a className='button' onClick={this.saveMap.bind(this)}>Save </a>
          Zoom: <input type='number' value={this.state.zoom} onChange={this.changeZoom.bind(this)}/>
        </div>
        <div>
          Paint: {_.map([{minval:0,maxval:0,emoji:'⬛'}].concat(this.state.palette),(p)=>{
            return <a onClick={_.bind(this.paletteClick,this,p)} className={'button '+(_.inRange(this.state.paint,p.minval,p.maxval+1) ? 'active' : '')}>{p.emoji}</a>
          })}
        </div>
        <MapCanvas ref='mapCanvas'
          width={this.state.zoom*99}
          height={this.state.zoom*99}
          zoom={this.state.zoom}
          map={this.state.map}
          palette={this.state.palette}
          mapClick={this.mapClick.bind(this)}
          />
        <textarea id='preview' value={this.state.preview}>

        </textarea>


      </div>
    );
  }
}

ReactDOM.render(<Admin />,document.getElementById('react'));
