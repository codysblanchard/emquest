import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

 class Admin extends React.Component{
   constructor(props){
     super(props);
     this.mouseDown=false;
     this.state = { map: {}, zoom:8 };
     this.api="http://localhost:3000/api/";
     this.ajax(this.api+'map/get',null,(map)=>{
       this.setState({map:map},this.drawMap.bind(this));
     });
   }
   ajax(uri,params,cb){
     var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
      if(req.readyState === 4) {
        if(req.status === 200) {
          cb(JSON.parse(req.responseText));
        } else {
          //error
        }
      }
    }

    req.open(_.isEmpty(params) ? 'GET' : 'POST', uri);
    req.send(JSON.stringify(params));
   }
   saveMap(){
    this.ajax(this.api+"map/save",{mapData:this.state.map},(r)=>{
       console.log(r);
     })
   }
   genMap(){
     this.ajax(this.api+"map/gen",null,(map)=>{
       this.setState({map:map},this.drawMap.bind(this))
     })
   }
   drawMap(){
     console.log('draw map');
     var c = this.refs.mapCanvas;
     var ctx = c.getContext("2d");
     var xsize=99;
     var ysize=99;
     _.map(this.state.map,function(m,index)
     {
          var color = m.val;
//console.log(m);
          ctx.fillStyle = "rgba("+color+","+color+","+color+","+1+")";
           ctx.fillRect( m.x*this.state.zoom, m.y*this.state.zoom, this.state.zoom, this.state.zoom );
           return null;
       }.bind(this));
   }
   mapMouse(e){
     //console.log(e);
     if(this.mouseDown){
       this.setState({
         map:_.map(this.state.map,(m)=>{
           return m.x == Math.round((e.clientX - this.refs.mapCanvas.offsetLeft) / this.state.zoom) && m.y == Math.round ( (e.clientY - this.refs.mapCanvas.offsetTop) / this.state.zoom ) ? _.merge({},m,{val:0}) : m
         })
       },_.throttle(_.bind(this.drawMap,this)),500)
     }
   }
   getCanvasPos(){

   }
   mapUnclick(e){
     this.mouseDown=false;
   }
   mapClick(e){
     this.mouseDown=true;
   }
  render(){
    return (
      <div>
        <div>
          <a onClick={this.genMap.bind(this)}>Generate</a>
          <a onClick={this.saveMap.bind(this)}>Save</a>
        </div>
        <canvas ref='mapCanvas' onMouseMove={this.mapMouse.bind(this)} width='800' height='800' onMouseDown={this.mapClick.bind(this)}  onMouseUp={this.mapUnclick.bind(this)} id='mapCanvas'/>


      </div>
    );
  }
}

ReactDOM.render(<Admin />,document.getElementById('react'));
