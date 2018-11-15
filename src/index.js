import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

 class Admin extends React.Component{
   constructor(props){
     super(props);
     this.mouseDown=false;
     this.state = { map: {}, zoom:12,palette:{} };
     this.api="http://localhost:3000/api/";
     this.ajax(this.api+'map/get',null,(map)=>{
       this.ajax(this.api+'palette/get',null,(palette)=>{
         this.setState({palette:palette,map:map},this.drawMap.bind(this))
       })
       //this.setState({map:map},this.drawMap.bind(this));
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
     ctx.font="14px Arial";
     ctx.fillStyle="rgba(0,0,0,1)";
     var xsize=99;
     var ysize=99;
     _.map(this.state.map,function(m,index)
     {
          var color = m.val;
//console.log(m);
          //if(color==0){
            ctx.fillStyle = "rgba("+color+","+color+","+color+","+1+")";
           ctx.fillRect( m.x*this.state.zoom, m.y*this.state.zoom, this.state.zoom, this.state.zoom );
         //}else{
           if(color>0){
             ctx.fillStyle=color > 125 ? "rgba(0,0,0,1)" : "rgba(0,200,0,1)";
             ctx.fillText(_.get(_.find(this.state.palette,(p)=>{return p.minval<=m.val && p.maxval>=m.val}),'emoji'),m.x*this.state.zoom,m.y*this.state.zoom+this.state.zoom);
           }
           //}
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
        <canvas ref='mapCanvas' onMouseMove={this.mapMouse.bind(this)} width={this.state.zoom*99} height={this.state.zoom*99} onMouseDown={this.mapClick.bind(this)}  onMouseUp={this.mapUnclick.bind(this)} id='mapCanvas'/>


      </div>
    );
  }
}

ReactDOM.render(<Admin />,document.getElementById('react'));
